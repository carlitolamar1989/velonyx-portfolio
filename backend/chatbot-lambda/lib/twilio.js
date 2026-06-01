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

module.exports = {
  configured: configured,
  sendSms: sendSms,
  parseInbound: parseInbound,
  twimlReply: twimlReply,
  twimlEmpty: twimlEmpty,
  isStop: isStop,
  isHelp: isHelp,
  FROM: FROM
};
