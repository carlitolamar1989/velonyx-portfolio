/**
 * Twilio REST client — Messages API only.
 *
 * Sends outbound SMS and parses inbound webhook bodies.
 * No npm dep — direct REST + Basic Auth.
 *
 * Required env vars:
 *   TWILIO_ACCOUNT_SID   ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 *   TWILIO_AUTH_TOKEN    <secret from console.twilio.com>
 *   TWILIO_PHONE_FROM    +1XXXXXXXXXX  (10DLC-registered for US)
 */
const http = require('./http');
const querystring = require('querystring');

const SID   = process.env.TWILIO_ACCOUNT_SID || '';
const TOKEN = process.env.TWILIO_AUTH_TOKEN  || '';
const FROM  = process.env.TWILIO_PHONE_FROM  || '';

function configured() {
  return Boolean(SID && TOKEN && FROM);
}

function basicAuth() {
  return 'Basic ' + Buffer.from(SID + ':' + TOKEN).toString('base64');
}

// ── Send outbound SMS ────────────────────────────────────────────────────────
async function sendSms(to, body) {
  if (!configured()) throw new Error('twilio not configured');
  if (!to) throw new Error('sendSms: to required');
  if (!body) throw new Error('sendSms: body required');
  const payload = querystring.stringify({ To: to, From: FROM, Body: body });
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
