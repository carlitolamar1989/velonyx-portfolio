/**
 * Twilio REST client — Messages API only.
 *
 * Sends outbound SMS and parses inbound webhook bodies.
 * No npm dep — direct REST + Basic Auth.
 *
 * Required env vars:
 *   TWILIO_ACCOUNT_SID            ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   TWILIO_AUTH_TOKEN             <secret from console.twilio.com>
 *
 * Sender — pick ONE (Messaging Service preferred for toll-free + 10DLC):
 *   TWILIO_MESSAGING_SERVICE_SID  MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  (preferred)
 *   TWILIO_PHONE_FROM             +1XXXXXXXXXX  (fallback if no service)
 */
const http = require('./http');
const querystring = require('querystring');

const SID         = process.env.TWILIO_ACCOUNT_SID || '';
const TOKEN       = process.env.TWILIO_AUTH_TOKEN  || '';
const FROM        = process.env.TWILIO_PHONE_FROM  || '';
const MSG_SVC_SID = process.env.TWILIO_MESSAGING_SERVICE_SID || '';

function configured() {
  return Boolean(SID && TOKEN && (MSG_SVC_SID || FROM));
}

function basicAuth() {
  return 'Basic ' + Buffer.from(SID + ':' + TOKEN).toString('base64');
}

// ── Send outbound SMS ────────────────────────────────────────────────────────
// Uses MessagingServiceSid if TWILIO_MESSAGING_SERVICE_SID is set (recommended
// for toll-free senders + 10DLC). Falls back to raw From= number otherwise.
async function sendSms(to, body) {
  if (!configured()) throw new Error('twilio not configured');
  if (!to) throw new Error('sendSms: to required');
  if (!body) throw new Error('sendSms: body required');
  const params = { To: to, Body: body };
  if (MSG_SVC_SID) {
    params.MessagingServiceSid = MSG_SVC_SID;
  } else {
    params.From = FROM;
  }
  const payload = querystring.stringify(params);
  const res = await http.post(
    'https://api.twilio.com/2010-04-01/Accounts/' + SID + '/Messages.json',
    {
      headers: {
        'Authorization': basicAuth(),
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      body: payload
    }
  );
  if (res.status >= 300) throw new Error('twilio sendSms ' + res.status + ': ' + res.raw);
  return res.body;
}

// ── Parse Twilio inbound webhook body ────────────────────────────────────────
// Twilio POSTs form-urlencoded: From, Body, MessageSid, To, etc.
function parseInbound(rawBody) {
  if (!rawBody) return {};
  const parsed = querystring.parse(rawBody);
  return {
    from:      parsed.From || '',
    to:        parsed.To || '',
    body:      parsed.Body || '',
    messageSid:parsed.MessageSid || '',
    raw:       parsed
  };
}

// ── Build TwiML response (for /sms/inbound) ──────────────────────────────────
function twimlReply(text) {
  const esc = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return '<?xml version="1.0" encoding="UTF-8"?><Response><Message>' + esc + '</Message></Response>';
}
function twimlEmpty() {
  return '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
}

// ── STOP / HELP keyword detection ────────────────────────────────────────────
function isStop(body) {
  if (!body) return false;
  return /^\s*(stop|stopall|unsubscribe|cancel|end|quit)\s*$/i.test(body);
}
function isHelp(body) {
  if (!body) return false;
  return /^\s*(help|info)\s*$/i.test(body);
}

// ── Voice (Programmable Voice) ───────────────────────────────────────────────
// Inbound calls hit the Lambda /voice + /voice/turn routes. Twilio's
// <Gather input="speech"> does the speech-to-text; <Say voice="Polly.*-Neural">
// does the text-to-speech. Turn-based — fits the request/response Lambda model
// with no extra infra. TWILIO_VOICE overrides the spoken voice.
function xmlEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
function voiceName() { return process.env.TWILIO_VOICE || 'Polly.Joanna-Neural'; }
var XML_DECL = '<?xml version="1.0" encoding="UTF-8"?>';

// Parse Twilio voice webhook (form-urlencoded): From, To, CallSid, SpeechResult,
// CallStatus, plus DialCallStatus on the <Dial> action callback.
function parseVoice(rawBody) {
  if (!rawBody) return {};
  var p = querystring.parse(rawBody);
  return {
    from:         p.From || '',
    to:           p.To || '',
    callSid:      p.CallSid || '',
    speechResult: p.SpeechResult || '',
    confidence:   p.Confidence || '',
    callStatus:   p.CallStatus || '',
    dialStatus:   p.DialCallStatus || '',   // present only on a <Dial action> callback
    raw:          p
  };
}

// Speak `sayText`, then listen for the caller's reply and POST it to actionPath.
// If the caller stays silent, the trailing <Say>+<Redirect> re-prompts via the
// same route (which re-Gathers when SpeechResult is empty).
function twimlGather(sayText, actionPath) {
  var v = voiceName(), a = xmlEsc(actionPath);
  return XML_DECL
    + '<Response>'
    + '<Gather input="speech" speechTimeout="auto" speechModel="phone_call" language="en-US" action="' + a + '" method="POST">'
    + '<Say voice="' + v + '">' + xmlEsc(sayText) + '</Say>'
    + '</Gather>'
    + '<Say voice="' + v + '">Sorry, I didn\'t catch that.</Say>'
    + '<Redirect method="POST">' + a + '</Redirect>'
    + '</Response>';
}

function twimlSay(text) {
  return XML_DECL + '<Response><Say voice="' + voiceName() + '">' + xmlEsc(text) + '</Say></Response>';
}

function twimlHangup(sayText) {
  var v = voiceName();
  return XML_DECL + '<Response>'
    + (sayText ? '<Say voice="' + v + '">' + xmlEsc(sayText) + '</Say>' : '')
    + '<Hangup/></Response>';
}

// Say `sayText`, then dial `number` (Carlos's cell). When the dial ends Twilio
// POSTs DialCallStatus to actionPath so we can fall back to a message if missed.
function twimlDial(number, sayText, actionPath) {
  var v = voiceName();
  var dialAttrs = ' timeout="20"' + (actionPath ? ' action="' + xmlEsc(actionPath) + '" method="POST"' : '') + (FROM ? ' callerId="' + xmlEsc(FROM) + '"' : '');
  return XML_DECL + '<Response>'
    + (sayText ? '<Say voice="' + v + '">' + xmlEsc(sayText) + '</Say>' : '')
    + '<Dial' + dialAttrs + '>' + xmlEsc(number) + '</Dial>'
    + '</Response>';
}

module.exports = {
  configured: configured,
  sendSms: sendSms,
  parseInbound: parseInbound,
  twimlReply: twimlReply,
  twimlEmpty: twimlEmpty,
  isStop: isStop,
  isHelp: isHelp,
  FROM: FROM,
  // voice
  parseVoice: parseVoice,
  twimlGather: twimlGather,
  twimlSay: twimlSay,
  twimlHangup: twimlHangup,
  twimlDial: twimlDial,
  voiceName: voiceName
};
