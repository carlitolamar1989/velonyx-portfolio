/**
 * Velonyx Unified AI Lead System — AWS Lambda backend
 *
 * One Lambda handles three routes via path-based dispatch:
 *
 *   POST /chat          → Chatbot Q&A (Anthropic + capture_lead + redirect_to_page + initiate_lead_capture)
 *   POST /form-turn     → Conversational lead form (Anthropic + complete_capture; on completion: Supabase write + SMS opener + owner notify)
 *   POST /sms/inbound   → Twilio webhook for inbound SMS (Anthropic + book_call + handoff_to_carlos; replies via TwiML)
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY           — Anthropic Console
 *   SUPABASE_URL                — https://<project>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY   — Supabase → Settings → API → service_role
 *   TWILIO_ACCOUNT_SID          — Twilio → Account Info
 *   TWILIO_AUTH_TOKEN           — same
 *   TWILIO_PHONE_FROM           — +1XXXXXXXXXX, 10DLC-registered for US
 *   RESEND_API_KEY              — resend.com → API Keys
 *   RESEND_FROM_ADDRESS         — verified sender, e.g. "Velonyx <leads@velonyxsystems.com>"
 *   OWNER_EMAIL                 — where lead alerts go (default: admin@velonyxsystems.com)
 *   OWNER_PHONE                 — where lead-alert SMS goes (E.164)
 *   ALLOWED_ORIGIN              — CORS origin (default: https://velonyxsystems.com)
 *   LEADS_ENDPOINT              — legacy endpoint, optional; kept for back-compat
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const supabase = require('./lib/supabase');
const twilio   = require('./lib/twilio');
const resend   = require('./lib/resend');
const intent   = require('./lib/intent');

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS_PER_TURN = 800;
const MAX_HISTORY_TURNS = 20;
const MAX_SMS_TURNS_PER_LEAD = 30;
const MAX_FORM_TURNS = 15;
const MAX_VOICE_TURNS = 25;
const CALENDLY_URL = 'https://calendly.com/admin-velonyxsystems';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://velonyxsystems.com';
const OWNER_EMAIL    = process.env.OWNER_EMAIL || 'admin@velonyxsystems.com';
const OWNER_PHONE    = process.env.OWNER_PHONE || '';

// Cold-start: load three system prompts from sibling files
const PROMPTS = {
  chat:  loadPrompt('system-prompt.md',       'You are the Velonyx Assistant. Help prospects understand Velonyx and capture leads.'),
  form:  loadPrompt('system-prompt-form.md',  'You are the Velonyx Assistant in form mode. Collect name + phone + interest.'),
  sms:   loadPrompt('system-prompt-sms.md',   'You are the Velonyx Assistant via SMS. Continue the conversation, book the call.'),
  voice: loadPrompt('system-prompt-voice.md', 'You are the Velonyx Assistant answering a phone call. Keep replies to 1-2 short spoken sentences. Answer questions about Velonyx and book a call.')
};
function loadPrompt(file, fallback) {
  try { return fs.readFileSync(path.join(__dirname, file), 'utf8'); }
  catch (e) { console.error('prompt load failed:', file, e.message); return fallback; }
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Legacy leads endpoint — fallback sink when Supabase is unavailable, so a
// captured lead is never lost to an infra hiccup.
const httpClient = require('./lib/http');
async function postLead(payload) {
  return httpClient.post(LEADS_ENDPOINT, { body: payload, timeout: 8000 });
}

// ──────────────────────────────────────────────────────────────────────────────
// Tool definitions
// ──────────────────────────────────────────────────────────────────────────────

const VALID_TIERS = ['essentials', 'growth', 'elite', 'video'];

const TOOLS_CHAT = [
  {
    name: 'capture_lead',
    description: 'Capture the prospect\'s contact info when they share it directly in chat (not via the conversational form). Use for low-friction quick captures.',
    input_schema: {
      type: 'object',
      properties: {
        name:    { type: 'string', description: 'Prospect\'s name. Required.' },
        phone:   { type: 'string', description: 'Prospect\'s phone. Required.' },
        email:   { type: 'string', description: 'Email if provided, else empty.' },
        service: { type: 'string', description: 'Tier or service they\'re interested in.' },
        summary: { type: 'string', description: 'Short summary of context.' }
      },
      required: ['name', 'phone', 'summary']
    }
  },
  {
    name: 'redirect_to_page',
    description: 'Render a gold pill button under your text reply that takes the prospect to a specific page. Use when their question maps cleanly to a page. Max once per turn.',
    input_schema: {
      type: 'object',
      properties: {
        page: { type: 'string', enum: ['book', 'checkout', 'financing', 'refund-policy', 'demo'] },
        tier: { type: 'string', enum: VALID_TIERS, description: 'Required only when page=checkout.' }
      },
      required: ['page']
    }
  },
  {
    name: 'initiate_lead_capture',
    description: 'Hand off to the conversational lead form. Call this when the visitor shows clear buying intent ("I want one", "how do I start", "sign me up", asks pricing in a buying way, asks for a call). The widget will smoothly transition the chat panel into the form. After firing, your text reply should be short and natural — e.g. "Let\'s grab your details — first, what\'s your name?"',
    input_schema: { type: 'object', properties: {}, required: [] }
  }
];

const TOOLS_FORM = [
  {
    name: 'complete_capture',
    description: 'Save the lead once you have name, valid phone, and a short interest description. Phone will be re-validated server-side. After this fires, an SMS is sent to the lead within seconds.',
    input_schema: {
      type: 'object',
      properties: {
        name:     { type: 'string', description: 'First name minimum.' },
        phone:    { type: 'string', description: 'US/Canada phone, any common format.' },
        interest: { type: 'string', description: '1-2 sentence description of what they need.' }
      },
      required: ['name', 'phone', 'interest']
    }
  }
];

const TOOLS_SMS = [
  {
    name: 'book_call',
    description: 'Send the lead a Calendly link to book the 20-minute discovery call. Use when they show clear intent ("let\'s talk", "send me a time", "when can we set this up").',
    input_schema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'handoff_to_carlos',
    description: 'Flag the conversation for owner follow-up. Use when the lead asks something you shouldn\'t answer (refunds, custom contracts, pricing exceptions), or after ~10 turns without booking.',
    input_schema: {
      type: 'object',
      properties: {
        reason:  { type: 'string', description: 'Why handing off.' },
        summary: { type: 'string', description: 'What Carlos should know going in.' }
      },
      required: ['reason']
    }
  }
];

const TOOLS_VOICE = [
  {
    name: 'book_call',
    description: 'Text the caller a Calendly link to book the 20-minute discovery call, and confirm out loud. Use when they show clear intent ("let\'s set it up", "send me a time", "how do I start").',
    input_schema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'transfer_to_human',
    description: 'Transfer the live call to Carlos (the owner). Use when the caller explicitly asks for a person, or asks something you should not answer on a call (refunds, custom contracts, pricing exceptions). The owner is also alerted with the conversation summary.',
    input_schema: {
      type: 'object',
      properties: {
        reason:  { type: 'string', description: 'Why transferring.' },
        summary: { type: 'string', description: 'What Carlos should know going in.' }
      },
      required: ['reason']
    }
  },
  {
    name: 'end_call',
    description: 'Politely end the call when the caller says goodbye, is done, or has no more questions.',
    input_schema: { type: 'object', properties: {}, required: [] }
  }
];

// ──────────────────────────────────────────────────────────────────────────────
// Common helpers
// ──────────────────────────────────────────────────────────────────────────────

function corsHeaders(contentType) {
  return {
    'Access-Control-Allow-Origin':  ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type':                 contentType || 'application/json'
  };
}

function jsonResponse(status, payload) {
  return { statusCode: status, headers: corsHeaders('application/json'), body: JSON.stringify(payload) };
}

function getPath(event) {
  return (event && (event.rawPath || (event.requestContext && event.requestContext.http && event.requestContext.http.path))) || '';
}
function getMethod(event) {
  return (event && event.requestContext && event.requestContext.http && event.requestContext.http.method) || 'POST';
}
// API Gateway HTTP API base64-encodes form-urlencoded bodies (isBase64Encoded:true).
// Decode before parsing so Twilio's From/Body/SpeechResult fields are readable.
function rawBody(event) {
  var b = (event && event.body) || '';
  if (event && event.isBase64Encoded) { try { return Buffer.from(b, 'base64').toString('utf8'); } catch (e) { return b; } }
  return b;
}

// URL whitelist sanitizer for chat replies
const URL_WHITELIST = ['velonyxsystems.com', 'gdk.velonyxsystems.com', 'buy.stripe.com', 'calendly.com'];
function sanitizeUrls(text) {
  return String(text || '').replace(/https?:\/\/[^\s)]+/gi, function(match) {
    let host = '';
    try { host = new URL(match).hostname; } catch (e) { return ''; }
    const ok = URL_WHITELIST.some(function(w) { return host.endsWith(w); });
    return ok ? match : '[link removed]';
  });
}

// Jailbreak pre-filter for chat / form (NOT SMS — Twilio messages are already authenticated by phone)
const BLOCKED_PATTERNS = [
  /ignore (all |previous |the )?(instructions|prompt|system)/i,
  /reveal (your |the )?(prompt|system|instructions)/i,
  /pretend (you'?re|to be) (a |an )?(?!velonyx)/i,
  /jailbreak/i,
  /developer mode/i,
  /dan mode/i
];
function isJailbreak(text) {
  return BLOCKED_PATTERNS.some(function(p) { return p.test(text || ''); });
}

function resolveRedirect(input) {
  if (!input || !input.page) return null;
  switch (input.page) {
    case 'book':          return { url: '/book.html', label: 'Book a Discovery Call' };
    case 'checkout': {
      const tier = (input.tier || '').toLowerCase();
      if (VALID_TIERS.indexOf(tier) === -1) return null;
      const labels = {
        essentials: 'View Essentials ($700 + $70/mo)',
        growth:     'View Growth ($900 + $150/mo)',
        elite:      'View Elite ($1,200 + $400/mo)',
        video:      'View AI Video ($200/mo)'
      };
      return { url: '/checkout.html?tier=' + tier, label: labels[tier] };
    }
    case 'financing':     return { url: '/financing.html', label: 'See Financing Options' };
    case 'refund-policy': return { url: '/refund-policy.html', label: 'Read the Refund Policy' };
    case 'demo':          return { url: '/#work', label: 'See Our Live Demos' };
    default:              return null;
  }
}

function buildMessages(history, currentUserMessage) {
  const messages = [];
  if (Array.isArray(history)) {
    for (const turn of history.slice(-MAX_HISTORY_TURNS)) {
      if ((turn.role === 'user' || turn.role === 'assistant') && typeof turn.content === 'string' && turn.content.length > 0) {
        messages.push({ role: turn.role, content: turn.content });
      }
    }
  }
  if (currentUserMessage) messages.push({ role: 'user', content: currentUserMessage });
  return messages;
}

// ──────────────────────────────────────────────────────────────────────────────
// Route: POST /chat
// ──────────────────────────────────────────────────────────────────────────────

async function handleChat(event) {
  let body;
  try { body = JSON.parse(rawBody(event) || '{}'); }
  catch (e) { return jsonResponse(400, { error: 'invalid json' }); }

  const { sessionId, message, history } = body;
  if (!message || typeof message !== 'string') return jsonResponse(400, { error: 'message required' });

  if (isJailbreak(message)) {
    return jsonResponse(200, { reply: "I only answer questions about Velonyx Systems — pricing, what's in each tier, how the AI lead system works, and how to book a call. What can I help you with?" });
  }

  const messages = buildMessages(history, message);

  let assistantText = '';
  let leadCaptured = false;
  let redirect = null;
  let handoff = false;
  let leadTier = null;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS_PER_TURN,
      system: PROMPTS.chat,
      tools: TOOLS_CHAT,
      messages: messages
    });

    for (const block of (response.content || [])) {
      if (block.type === 'text') {
        assistantText += block.text;
      } else if (block.type === 'tool_use') {
        if (block.name === 'capture_lead') {
          await tryCaptureLeadFromChat(block.input || {}, sessionId);
          leadCaptured = true;
        } else if (block.name === 'redirect_to_page') {
          if (!redirect) {
            const r = resolveRedirect(block.input || {});
            if (r) {
              redirect = r;
              if (block.input && block.input.page === 'checkout' && block.input.tier) leadTier = block.input.tier;
            }
          }
        } else if (block.name === 'initiate_lead_capture') {
          handoff = true;
        }
      }
    }

    if (!assistantText && leadCaptured)  assistantText = "Got it. Carlos will reach out within 1 hour.";
    if (!assistantText && handoff)       assistantText = "Let's grab your details — what's your name?";
    if (!assistantText)                  assistantText = "Want me to grab your details so Carlos can follow up directly?";

  } catch (err) {
    console.error('chat anthropic failed', err);
    return jsonResponse(200, {
      reply: "I'm having trouble connecting right now. Drop your phone number and Carlos will reach out directly.",
      error: true
    });
  }

  return jsonResponse(200, {
    reply: sanitizeUrls(assistantText),
    leadCaptured: leadCaptured,
    redirect: redirect,
    tier: leadTier,
    handoff: handoff
  });
}

async function tryCaptureLeadFromChat(args, sessionId) {
  const phone = intent.normalizePhone(args.phone);
  if (!phone) return; // silently skip — model fired tool with bad phone
  const nameParts = (args.name || 'Chatbot Lead').trim().split(/\s+/);
  const record = {
    name:     args.name || 'Chatbot Lead',
    phone:    phone,
    email:    args.email || null,
    interest: args.service || args.summary || 'Chatbot inquiry',
    source:   'chatbot',
    status:   'new',
    conversation_log: [{ role: 'bot', text: args.summary || '', ts: new Date().toISOString(), channel: 'chat' }],
    meta:     { session_id: sessionId || '', captured_via: 'chat_capture_lead_tool' }
  };
  try {
    if (supabase.configured()) {
      const lead = await supabase.insertLead(record);
      notifyOwnerAsync(lead).catch(function(e) { console.error('notify failed', e); });
    } else {
      console.warn('supabase not configured — chat lead skipped supabase write');
    }
  } catch (err) {
    console.error('chat capture supabase failed', err);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Route: POST /form-turn
// ──────────────────────────────────────────────────────────────────────────────

async function handleFormTurn(event) {
  let body;
  try { body = JSON.parse(rawBody(event) || '{}'); }
  catch (e) { return jsonResponse(400, { error: 'invalid json' }); }

  const { sessionId, message, history, formState } = body;
  if (!message || typeof message !== 'string') return jsonResponse(400, { error: 'message required' });

  // Hard cap on form length
  const turnCount = (Array.isArray(history) ? history.length : 0);
  if (turnCount >= MAX_FORM_TURNS * 2) {
    return jsonResponse(200, { reply: "Let me just connect you with Carlos directly — what's the best phone number?", completed: false, capped: true });
  }

  if (isJailbreak(message)) {
    return jsonResponse(200, { reply: "I'm just here to take your name and number. What's the best phone to reach you?" });
  }

  const messages = buildMessages(history, message);

  let assistantText = '';
  let completed = false;
  let leadId = null;
  let captured = null;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS_PER_TURN,
      system: PROMPTS.form,
      tools: TOOLS_FORM,
      messages: messages
    });

    for (const block of (response.content || [])) {
      if (block.type === 'text') {
        assistantText += block.text;
      } else if (block.type === 'tool_use' && block.name === 'complete_capture') {
        captured = block.input || {};
      }
    }

    if (captured) {
      const phone = intent.normalizePhone(captured.phone);
      if (!phone) {
        // Model claimed completion but phone is bad — re-prompt
        assistantText = "That number doesn't look complete — try again with all 10 digits?";
      } else {
        // Save → Supabase
        const record = {
          name:     captured.name || '',
          phone:    phone,
          email:    null,
          interest: captured.interest || '',
          source:   'form',
          status:   'sms_active',
          conversation_log: collectFormTranscript(history, message, assistantText),
          meta:     { session_id: sessionId || '', captured_via: 'form_complete_capture_tool' }
        };
        // Persist to Supabase if reachable. If the table is missing or Supabase
        // is down, DO NOT break the visitor's experience — fall back to the
        // legacy leads endpoint and still fire SMS + owner notify off the
        // captured record. A lead is never lost to an infra hiccup.
        let lead = null;
        if (supabase.configured()) {
          try {
            lead = await supabase.insertLead(record);
            leadId = lead.id;
          } catch (e) {
            console.error('supabase insert failed — falling back to legacy endpoint', e);
          }
        }
        completed = true;
        if (lead) {
          // Full path: SMS opener + owner notify off the saved lead (has id for logging)
          Promise.all([
            sendOpeningSms(lead).catch(function(e) { console.error('opening sms failed', e); }),
            notifyOwnerAsync(lead).catch(function(e) { console.error('notify failed', e); })
          ]);
        } else {
          // Degraded path: no Supabase row, but still text the lead + alert owner +
          // drop the lead into the legacy endpoint so nothing is lost.
          const fallbackLead = Object.assign({ id: 'nodb-' + (sessionId || Date.now()) }, record);
          Promise.all([
            sendOpeningSms(fallbackLead).catch(function(e) { console.error('fallback opening sms failed', e); }),
            notifyOwnerAsync(fallbackLead).catch(function(e) { console.error('fallback notify failed', e); }),
            postLead({
              firstName: (record.name || 'Form').split(/\s+/)[0],
              lastName:  (record.name || 'Lead').split(/\s+/).slice(1).join(' ') || 'Lead',
              phone:     record.phone,
              email:     '',
              service:   record.interest || 'Form lead',
              description: 'Form lead (Supabase unavailable). Session: ' + (sessionId || 'unknown'),
              source:    'form-nodb'
            }).catch(function(e) { console.error('legacy fallback post failed', e); })
          ]);
        }
        if (!assistantText) assistantText = "Got it. Texting you now from our line — answer right back and I'll take it from there.";
      }
    }

    if (!assistantText) assistantText = "Got it. What's your name?";

  } catch (err) {
    console.error('form anthropic failed', err);
    return jsonResponse(200, {
      reply: "I'm having trouble — drop your phone number and we'll text you in 60 seconds.",
      error: true
    });
  }

  return jsonResponse(200, {
    reply: assistantText,
    completed: completed,
    leadId: leadId
  });
}

function collectFormTranscript(history, latestUser, latestBot) {
  const log = [];
  if (Array.isArray(history)) {
    for (const turn of history) {
      if (turn && turn.role && turn.content) {
        log.push({ role: turn.role === 'assistant' ? 'bot' : 'user', text: turn.content, ts: new Date().toISOString(), channel: 'form' });
      }
    }
  }
  if (latestUser) log.push({ role: 'user', text: latestUser, ts: new Date().toISOString(), channel: 'form' });
  if (latestBot)  log.push({ role: 'bot',  text: latestBot,  ts: new Date().toISOString(), channel: 'form' });
  return log;
}

// ──────────────────────────────────────────────────────────────────────────────
// Route: POST /sms/inbound  (Twilio webhook target — body is form-urlencoded)
// ──────────────────────────────────────────────────────────────────────────────

async function handleSmsInbound(event) {
  // Twilio sends application/x-www-form-urlencoded (API GW base64-encodes it)
  const raw = rawBody(event);
  const parsed = twilio.parseInbound(raw);
  const from = parsed.from;
  const messageBody = (parsed.body || '').trim();

  if (!from || !messageBody) {
    return { statusCode: 200, headers: { 'Content-Type': 'text/xml' }, body: twilio.twimlEmpty() };
  }

  // STOP keyword — Twilio handles delivery suppression carrier-side, but we
  // still mark the lead closed and ack.
  if (twilio.isStop(messageBody)) {
    try {
      if (supabase.configured()) {
        const lead = await supabase.findLeadByPhone(from);
        if (lead) await supabase.updateLead(lead.id, { status: 'stopped' });
      }
    } catch (e) { console.error('stop handling failed', e); }
    return { statusCode: 200, headers: { 'Content-Type': 'text/xml' }, body: twilio.twimlEmpty() };
  }

  if (twilio.isHelp(messageBody)) {
    const helpText = "Velonyx Systems — premium AI lead systems for service businesses. Reply STOP to opt out. Info: velonyxsystems.com";
    return { statusCode: 200, headers: { 'Content-Type': 'text/xml' }, body: twilio.twimlReply(helpText) };
  }

  // Look up the lead by phone — they must have submitted the form first
  let lead = null;
  try {
    if (supabase.configured()) lead = await supabase.findLeadByPhone(from);
  } catch (e) { console.error('sms lead lookup failed', e); }

  if (!lead) {
    // Unknown sender — minimal acknowledgement, no auto-conversation
    const unknownReply = "Thanks — this line is for Velonyx Systems leads. Visit velonyxsystems.com to get started, or reply STOP to opt out.";
    return { statusCode: 200, headers: { 'Content-Type': 'text/xml' }, body: twilio.twimlReply(unknownReply) };
  }

  // Hard cap on SMS thread length
  const smsLog = (lead.conversation_log || []).filter(function(t) { return t.channel === 'sms'; });
  if (smsLog.length >= MAX_SMS_TURNS_PER_LEAD) {
    await supabase.updateLead(lead.id, { status: 'handed_off' });
    notifyOwnerAsync(lead, 'SMS thread capped — please call').catch(function(e) { console.error(e); });
    return { statusCode: 200, headers: { 'Content-Type': 'text/xml' }, body: twilio.twimlReply("Carlos will follow up by phone shortly.") };
  }

  // Append inbound user turn to conversation_log
  const userTurn = { role: 'user', text: messageBody, ts: new Date().toISOString(), channel: 'sms' };
  try { await supabase.appendTurn(lead.id, userTurn); }
  catch (e) { console.error('appendTurn user failed', e); }

  // Build history for Claude from previous SMS + form turns
  const allTurns = (lead.conversation_log || []).concat([userTurn]);
  const history = allTurns.map(function(t) {
    return { role: t.role === 'user' ? 'user' : 'assistant', content: t.text };
  });

  // Context preamble: tell the model who this lead is
  const contextLine = "Lead context — name: " + (lead.name || 'unknown') + " · interest: " + (lead.interest || 'unspecified') + ".";
  const messages = [{ role: 'user', content: contextLine }].concat(history.slice(-MAX_HISTORY_TURNS));

  let replyText = '';
  let bookCall = false;
  let handoff = null;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS_PER_TURN,
      system: PROMPTS.sms,
      tools: TOOLS_SMS,
      messages: messages
    });

    for (const block of (response.content || [])) {
      if (block.type === 'text') {
        replyText += block.text;
      } else if (block.type === 'tool_use') {
        if (block.name === 'book_call') bookCall = true;
        if (block.name === 'handoff_to_carlos') handoff = block.input || { reason: 'unspecified' };
      }
    }
  } catch (err) {
    console.error('sms anthropic failed', err);
    replyText = "One moment — Carlos will text you back personally.";
  }

  // If book_call fired, append the Calendly link
  if (bookCall) {
    replyText = (replyText || "Here's the link to book a 20-min call: ") + " https://calendly.com/admin-velonyxsystems";
    await supabase.updateLead(lead.id, { status: 'booked' });
  }

  // If handoff fired, escalate to owner
  if (handoff) {
    replyText = replyText || "Carlos will follow up by phone shortly.";
    await supabase.updateLead(lead.id, { status: 'handed_off' });
    notifyOwnerAsync(lead, handoff.reason + ' — ' + (handoff.summary || '')).catch(function(e) { console.error(e); });
  }

  // Append bot turn to log
  try {
    await supabase.appendTurn(lead.id, { role: 'bot', text: replyText, ts: new Date().toISOString(), channel: 'sms' });
  } catch (e) { console.error('appendTurn bot failed', e); }

  // Hard char cap so we don't send 5-segment SMS by accident
  if (replyText.length > 480) replyText = replyText.slice(0, 460) + '…';

  return { statusCode: 200, headers: { 'Content-Type': 'text/xml' }, body: twilio.twimlReply(replyText) };
}

// ──────────────────────────────────────────────────────────────────────────────
// Routes: POST /voice (call connects) + POST /voice/turn (each spoken turn)
// Twilio Programmable Voice webhooks — body is form-urlencoded; reply is TwiML.
// Same Claude brain + Supabase + tools as SMS; just speaks via <Say>/<Gather>.
// ──────────────────────────────────────────────────────────────────────────────

function voiceXml(twiml) {
  return { statusCode: 200, headers: { 'Content-Type': 'text/xml' }, body: twiml };
}
// Absolute callback URL so Twilio posts the next turn back to this same API.
function voiceTurnPath(event) {
  var host = (event && event.requestContext && event.requestContext.domainName)
    || (event && event.headers && (event.headers.host || event.headers.Host)) || '';
  return (host ? 'https://' + host : '') + '/voice/turn';
}
async function ensureVoiceLead(from, callSid, via) {
  if (!from || !supabase.configured()) return null;
  try {
    var lead = await supabase.findLeadByPhone(from);
    if (lead) return lead;
    return await supabase.insertLead({
      name: 'Caller ' + String(from).slice(-4),
      phone: from, email: null, interest: 'Inbound phone call',
      source: 'voice_inbound', status: 'voice_active', conversation_log: [],
      meta: { call_sid: callSid || '', captured_via: via || 'voice' }
    });
  } catch (e) { console.error('ensureVoiceLead failed', e); return null; }
}

// POST /voice — the call just connected: greet + open the first speech Gather.
async function handleVoiceConnect(event) {
  const parsed = twilio.parseVoice(rawBody(event));
  await ensureVoiceLead(parsed.from, parsed.callSid, 'voice_connect'); // capture the call early
  const greeting = "Thanks for calling Velonyx Systems. You've reached our A.I. assistant — I can answer questions and get you booked. How can I help?";
  return voiceXml(twilio.twimlGather(greeting, voiceTurnPath(event)));
}

// POST /voice/turn — a caller turn (SpeechResult) OR a <Dial> status callback.
async function handleVoiceTurn(event) {
  const parsed = twilio.parseVoice(rawBody(event));
  const from = parsed.from;
  const turnPath = voiceTurnPath(event);

  // <Dial action> callback — the live transfer to Carlos finished.
  if (parsed.dialStatus) {
    if (parsed.dialStatus === 'completed') {
      return voiceXml(twilio.twimlHangup("Thanks for calling Velonyx. Goodbye."));
    }
    return voiceXml(twilio.twimlGather(
      "Sorry, I couldn't reach him just now — he's been notified and will call you right back. Is there anything else I can help you with?",
      turnPath));
  }

  if (!from) {
    return voiceXml(twilio.twimlHangup("Sorry, we hit a problem on our end. Please call back. Goodbye."));
  }

  const speech = (parsed.speechResult || '').trim();
  // Silent turn — re-prompt without spending a model call.
  if (!speech) {
    return voiceXml(twilio.twimlGather("Are you still there? Tell me what you're looking for and I'll help.", turnPath));
  }

  const lead = await ensureVoiceLead(from, parsed.callSid, 'voice_turn');

  // Cap call length so a thread can't run forever.
  const voiceLog = ((lead && lead.conversation_log) || []).filter(function (t) { return t.channel === 'voice'; });
  if (voiceLog.length >= MAX_VOICE_TURNS) {
    if (lead) {
      try { await supabase.updateLead(lead.id, { status: 'handed_off' }); } catch (e) {}
      notifyOwnerAsync(lead, 'Voice call ran long — please follow up').catch(function (e) { console.error(e); });
    }
    return voiceXml(twilio.twimlHangup("I've got your details — Carlos will follow up by phone. Thanks for calling Velonyx. Goodbye."));
  }

  // Append the caller's turn.
  const userTurn = { role: 'user', text: speech, ts: new Date().toISOString(), channel: 'voice' };
  if (lead) { try { await supabase.appendTurn(lead.id, userTurn); } catch (e) { console.error('voice appendTurn user failed', e); } }

  // Build history for Claude.
  const allTurns = ((lead && lead.conversation_log) || []).concat([userTurn]);
  const history = allTurns.map(function (t) { return { role: t.role === 'user' ? 'user' : 'assistant', content: t.text }; });
  const contextLine = "Caller context — name: " + ((lead && lead.name) || 'unknown')
    + " · phone: " + from + " · interest: " + ((lead && lead.interest) || 'unspecified') + ".";
  const messages = [{ role: 'user', content: contextLine }].concat(history.slice(-MAX_HISTORY_TURNS));

  let replyText = '';
  let bookCall = false, transfer = null, endCall = false;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS_PER_TURN,
      system: PROMPTS.voice,
      tools: TOOLS_VOICE,
      messages: messages
    });
    for (const block of (response.content || [])) {
      if (block.type === 'text') replyText += block.text;
      else if (block.type === 'tool_use') {
        if (block.name === 'book_call') bookCall = true;
        else if (block.name === 'transfer_to_human') transfer = block.input || { reason: 'unspecified' };
        else if (block.name === 'end_call') endCall = true;
      }
    }
  } catch (err) {
    console.error('voice anthropic failed', err);
    replyText = "Sorry, I'm having a little trouble. Let me connect you with Carlos.";
    transfer = { reason: 'AI error' };
  }

  // book_call → text the Calendly link to the caller during the call.
  if (bookCall) {
    replyText = (replyText ? replyText + ' ' : "Perfect — ") + "I'm texting you the booking link now; tap it to pick a time.";
    try { if (twilio.configured()) await twilio.sendSms(from, "Book your Velonyx call here: " + CALENDLY_URL + " — reply STOP to opt out."); }
    catch (e) { console.error('voice book_call sms failed', e); }
    if (lead) { try { await supabase.updateLead(lead.id, { status: 'booked' }); } catch (e) {} }
  }

  // Log the bot turn before any transfer/hangup.
  if (lead) { try { await supabase.appendTurn(lead.id, { role: 'bot', text: replyText, ts: new Date().toISOString(), channel: 'voice' }); } catch (e) { console.error('voice appendTurn bot failed', e); } }

  // transfer_to_human → alert owner (with transcript) AND dial Carlos's cell.
  if (transfer) {
    if (lead) {
      try { await supabase.updateLead(lead.id, { status: 'handed_off' }); } catch (e) {}
      notifyOwnerAsync(lead, 'VOICE call — caller wants a human: ' + (transfer.reason || '') + ' ' + (transfer.summary || '')).catch(function (e) { console.error(e); });
    }
    const sayBefore = replyText || "Sure — let me connect you with Carlos now. One moment.";
    if (OWNER_PHONE) {
      // On no-answer/busy/failed, Twilio POSTs DialCallStatus back to turnPath (handled above).
      return voiceXml(twilio.twimlDial(OWNER_PHONE, sayBefore, turnPath));
    }
    return voiceXml(twilio.twimlGather(sayBefore + " He's been notified and will call you right back. Anything else?", turnPath));
  }

  if (endCall) {
    return voiceXml(twilio.twimlHangup(replyText || "Thanks for calling Velonyx Systems. Talk soon — goodbye."));
  }

  if (!replyText) replyText = "Could you tell me a bit more about what you need?";
  return voiceXml(twilio.twimlGather(replyText, turnPath));
}

// ──────────────────────────────────────────────────────────────────────────────
// Internal: send opening SMS after form completion
// ──────────────────────────────────────────────────────────────────────────────

async function sendOpeningSms(lead) {
  if (!twilio.configured()) {
    console.warn('twilio not configured — opening SMS skipped for lead', lead.id);
    return;
  }
  const firstName = (lead.name || '').split(/\s+/)[0] || 'there';
  const interestSnippet = (lead.interest || '').slice(0, 60);
  const body = "Hi " + firstName + ", it's the Velonyx Assistant. Got your note about " + interestSnippet
    + ". Carlos is looped in. Quick — when do you want to be live? Reply STOP to opt out.";
  // Send the SMS first (the part that matters to the lead). Logging the turn to
  // Supabase is best-effort — skip for fallback leads (synthetic id, no DB row).
  await twilio.sendSms(lead.phone, body);
  if (supabase.configured() && lead.id && String(lead.id).indexOf('nodb-') !== 0) {
    try {
      await supabase.appendTurn(lead.id, { role: 'bot', text: body, ts: new Date().toISOString(), channel: 'sms' });
    } catch (e) {
      console.error('opening sms log to supabase failed (non-fatal)', e);
    }
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Internal: notify owner (email via Resend + SMS via Twilio)
// ──────────────────────────────────────────────────────────────────────────────

async function notifyOwnerAsync(lead, extraNote) {
  const tasks = [];
  if (resend.configured()) tasks.push(notifyOwnerEmail(lead, extraNote));
  if (twilio.configured() && OWNER_PHONE) tasks.push(notifyOwnerSms(lead, extraNote));
  if (!tasks.length) {
    console.warn('notifyOwnerAsync: no channels configured (resend + owner_phone both missing)');
    return;
  }
  const results = await Promise.allSettled(tasks);
  // Mark notified_at even if one channel failed
  try {
    if (supabase.configured()) await supabase.updateLead(lead.id, { notified_at: new Date().toISOString() });
  } catch (e) { console.error('notified_at update failed', e); }
  for (const r of results) if (r.status === 'rejected') console.error('owner notify channel failed', r.reason);
}

async function notifyOwnerEmail(lead, extraNote) {
  const subject = 'New Velonyx Lead — ' + (lead.name || 'unknown') + ' · ' + (lead.phone || '');
  const snippetTurns = (lead.conversation_log || []).slice(-6).map(function(t) {
    return '<p style="margin:4px 0;"><b>' + (t.role || '?') + ' (' + (t.channel || '?') + '):</b> ' + escapeHtml(t.text || '') + '</p>';
  }).join('');
  const html =
    '<div style="font-family:sans-serif;color:#1a1a1a;max-width:560px;">' +
    '<h2 style="color:#B8860B;margin:0 0 8px;">New Velonyx Lead</h2>' +
    '<p><b>Name:</b> ' + escapeHtml(lead.name || '') + '</p>' +
    '<p><b>Phone:</b> ' + escapeHtml(lead.phone || '') + '</p>' +
    (lead.email ? '<p><b>Email:</b> ' + escapeHtml(lead.email) + '</p>' : '') +
    '<p><b>Interest:</b> ' + escapeHtml(lead.interest || '') + '</p>' +
    '<p><b>Source:</b> ' + escapeHtml(lead.source || '') + '</p>' +
    '<p><b>Status:</b> ' + escapeHtml(lead.status || '') + '</p>' +
    (extraNote ? '<p><b>Note:</b> ' + escapeHtml(extraNote) + '</p>' : '') +
    '<hr/>' +
    '<h3 style="margin:12px 0 4px;">Recent conversation</h3>' +
    snippetTurns +
    '<p style="margin-top:16px;font-size:12px;color:#666;">Lead ID: ' + lead.id + '</p>' +
    '</div>';
  return resend.sendEmail({ to: OWNER_EMAIL, subject: subject, html: html, text: subject });
}

async function notifyOwnerSms(lead, extraNote) {
  const body = 'New Velonyx lead: ' + (lead.name || '?') + ' ' + (lead.phone || '?')
    + ' — ' + (lead.interest || '').slice(0, 80)
    + (extraNote ? ' [' + extraNote.slice(0, 60) + ']' : '');
  return twilio.sendSms(OWNER_PHONE, body);
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, function(c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Lambda entrypoint — path-based dispatch
// ──────────────────────────────────────────────────────────────────────────────

exports.handler = async function(event) {
  const method = getMethod(event);
  const path   = getPath(event);

  // CORS preflight
  if (method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }

  try {
    if (path === '/chat' || path.endsWith('/chat'))                          return await handleChat(event);
    if (path === '/form-turn' || path.endsWith('/form-turn'))                return await handleFormTurn(event);
    if (path === '/sms/inbound' || path.endsWith('/sms/inbound'))            return await handleSmsInbound(event);
    if (path === '/voice/turn' || path.endsWith('/voice/turn'))              return await handleVoiceTurn(event);
    if (path === '/voice' || path.endsWith('/voice'))                        return await handleVoiceConnect(event);
  } catch (err) {
    console.error('route handler crashed', path, err);
    return jsonResponse(500, { error: 'internal error', path: path });
  }

  return jsonResponse(404, { error: 'unknown route', path: path });
};
