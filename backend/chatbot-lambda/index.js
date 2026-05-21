/**
 * Velonyx Assistant — AWS Lambda backend for the embeddable chatbot widget.
 *
 * Triggered by API Gateway HTTP API (POST /chat).
 * Calls Claude Haiku 4.5 via @anthropic-ai/sdk.
 * Uses tool use to capture leads into the existing leads endpoint.
 *
 * Environment variables (set in Lambda console):
 *   ANTHROPIC_API_KEY   — required. Create at console.anthropic.com.
 *   LEADS_ENDPOINT      — optional. Defaults to the production leads Lambda URL.
 *   ALLOWED_ORIGIN      — optional. CORS origin, defaults to https://velonyxsystems.com.
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const https = require('https');

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_INPUT_TOKENS_PER_SESSION = 8000;
const MAX_OUTPUT_TOKENS_PER_TURN = 800;

const LEADS_ENDPOINT = process.env.LEADS_ENDPOINT
  || 'https://jyo775chsk.execute-api.us-east-1.amazonaws.com/leads';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://velonyxsystems.com';

// Load the system prompt once on cold-start (read from sibling file).
let SYSTEM_PROMPT;
try {
  SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, 'system-prompt.md'), 'utf8');
} catch (e) {
  SYSTEM_PROMPT = 'You are the Velonyx Assistant. Help prospects understand the $700 build + $70/month platform and capture their contact info for Carlos.';
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Tool definition: capture_lead ──
const TOOLS = [
  {
    name: 'capture_lead',
    description: 'Capture the prospect\'s contact info so Carlos (founder) can follow up personally. Call this whenever the prospect shares a phone number, expresses serious interest, asks about pricing in a buying way, or specifically says they want to talk to Carlos.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Prospect\'s name. Required.' },
        phone: { type: 'string', description: 'Prospect\'s phone number. Required.' },
        email: { type: 'string', description: 'Prospect\'s email if provided, otherwise empty string.' },
        service: { type: 'string', description: 'Service or plan they\'re interested in (e.g. "Core build", "Full Partner", "Video standalone", "General inquiry").' },
        summary: { type: 'string', description: 'Short summary of the conversation context so Carlos has what they need before reaching out.' }
      },
      required: ['name', 'phone', 'summary']
    }
  }
];

// ── Helper: POST lead to the existing leads endpoint ──
function postLead(payload) {
  return new Promise(function(resolve, reject) {
    const url = new URL(LEADS_ENDPOINT);
    const body = JSON.stringify(payload);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 8000
    }, function(res) {
      let chunks = '';
      res.on('data', function(d) { chunks += d.toString(); });
      res.on('end', function() {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(chunks);
        else reject(new Error('leads endpoint ' + res.statusCode + ': ' + chunks));
      });
    });
    req.on('error', reject);
    req.on('timeout', function() { req.destroy(new Error('leads endpoint timeout')); });
    req.write(body);
    req.end();
  });
}

// ── Crude jailbreak / off-topic pre-filter ──
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

// ── URL whitelist for output sanitization ──
const URL_WHITELIST = [
  'velonyxsystems.com',
  'gdk.velonyxsystems.com',
  'buy.stripe.com',
  'calendly.com/admin-velonyxsystems'
];
function sanitizeUrls(text) {
  return text.replace(/https?:\/\/[^\s)]+/gi, function(match) {
    var host = '';
    try { host = new URL(match).hostname; } catch (e) { return ''; }
    var ok = URL_WHITELIST.some(function(w) { return host.endsWith(w); });
    return ok ? match : '[link removed]';
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}

exports.handler = async function(event) {
  // CORS preflight
  if (event.requestContext && event.requestContext.http && event.requestContext.http.method === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'invalid json' }) }; }

  const { sessionId, message, history } = body;
  if (!message || typeof message !== 'string') {
    return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'message required' }) };
  }

  // Jailbreak pre-filter
  if (isJailbreak(message)) {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        reply: "I only answer questions about Velonyx Systems — pricing, what's included, how the platform works, and how to book a call. What can I help you with about the platform?"
      })
    };
  }

  // Build messages array for Anthropic
  const messages = [];
  if (Array.isArray(history)) {
    for (const turn of history.slice(-20)) {
      if (turn.role === 'user' || turn.role === 'assistant') {
        if (typeof turn.content === 'string' && turn.content.length > 0) {
          messages.push({ role: turn.role, content: turn.content });
        }
      }
    }
  }
  messages.push({ role: 'user', content: message });

  let leadCaptured = false;
  let assistantText = '';

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS_PER_TURN,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages: messages
    });

    // Process content blocks
    const blocks = response.content || [];
    for (const block of blocks) {
      if (block.type === 'text') {
        assistantText += block.text;
      } else if (block.type === 'tool_use' && block.name === 'capture_lead') {
        const args = block.input || {};
        const nameParts = (args.name || 'Chatbot Lead').trim().split(/\s+/);
        const firstName = nameParts[0] || 'Chatbot';
        const lastName = nameParts.slice(1).join(' ') || 'Lead';
        const leadPayload = {
          firstName: firstName,
          lastName: lastName,
          phone: args.phone || '',
          email: args.email || '',
          service: args.service || 'Chatbot inquiry',
          description: 'Chatbot lead.\n\nSummary: ' + (args.summary || '') + '\n\nSession: ' + (sessionId || 'unknown'),
          source: 'chatbot'
        };
        try {
          await postLead(leadPayload);
          leadCaptured = true;
        } catch (err) {
          console.error('lead post failed', err);
          // Continue — bot still responds, lead capture failure is silent to user
        }
      }
    }

    // If model only emitted a tool use without a text follow-up, add a default confirmation
    if (!assistantText && leadCaptured) {
      assistantText = "Got it. Carlos will reach out within 1 hour. Anything else you'd like to share before then?";
    }
    if (!assistantText) {
      assistantText = "I'm not sure how to answer that one. Want me to get Carlos to follow up directly?";
    }
  } catch (err) {
    console.error('anthropic call failed', err);
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        reply: "I'm having trouble connecting right now. Drop your phone number and Carlos will reach out directly.",
        error: true
      })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: JSON.stringify({
      reply: sanitizeUrls(assistantText),
      leadCaptured: leadCaptured
    })
  };
};
