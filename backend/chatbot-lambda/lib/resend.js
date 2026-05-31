/**
 * Resend REST client — email send only.
 *
 * Required env vars:
 *   RESEND_API_KEY        re_xxxxxxxxxxxxxx
 *   RESEND_FROM_ADDRESS   "Velonyx <leads@velonyxsystems.com>"  (verified domain)
 */
const http = require('./http');

const KEY  = process.env.RESEND_API_KEY || '';
const FROM = process.env.RESEND_FROM_ADDRESS || 'Velonyx <leads@velonyxsystems.com>';

function configured() {
  return Boolean(KEY);
}

async function sendEmail(opts) {
  if (!configured()) throw new Error('resend not configured');
  if (!opts || !opts.to || !opts.subject) throw new Error('sendEmail: to + subject required');
  const payload = {
    from: opts.from || FROM,
    to: Array.isArray(opts.to) ? opts.to : [opts.to],
    subject: opts.subject,
    html: opts.html || '',
    text: opts.text || ''
  };
  if (opts.reply_to) payload.reply_to = opts.reply_to;
  const res = await http.post('https://api.resend.com/emails', {
    headers: {
      'Authorization': 'Bearer ' + KEY,
      'Content-Type':  'application/json'
    },
    body: payload
  });
  if (res.status >= 300) throw new Error('resend sendEmail ' + res.status + ': ' + res.raw);
  return res.body;
}

module.exports = {
  configured: configured,
  sendEmail: sendEmail,
  FROM: FROM
};
