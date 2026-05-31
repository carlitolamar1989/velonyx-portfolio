/**
 * Small intent + validation helpers used across routes.
 */

// ── Phone validation (server-side) ──────────────────────────────────────────
// Accepts US/Canada formats: +1XXXXXXXXXX, 1XXXXXXXXXX, XXXXXXXXXX, with
// punctuation. Returns E.164 normalized (+1XXXXXXXXXX) or null.
function normalizePhone(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits[0] === '1') return '+' + digits;
  return null;
}

function isValidPhone(raw) {
  return normalizePhone(raw) !== null;
}

// ── Buying-intent detection (heuristic — used as a fallback) ────────────────
// The model usually catches intent via its prompt + tool, but we keep a regex
// pre-check so we can wire UI hints fast (e.g. mid-message handoff buttons).
const INTENT_PATTERNS = [
  /how (do|can) i (start|begin|get started)/i,
  /(i want|i'?d like|i need) (one|to (buy|book|start|sign up))/i,
  /sign me up/i,
  /how much/i,
  /price\s?(s|ing)?/i,
  /get started/i,
  /let'?s do (this|it)/i,
  /book.{0,10}call/i,
  /talk to (someone|carlos|sales)/i,
  /interested in (the|a) /i,
  /can you build/i
];
function detectBuyingIntent(text) {
  if (!text) return false;
  return INTENT_PATTERNS.some(function(p) { return p.test(text); });
}

// ── Hash for rate-limit / privacy logs ──────────────────────────────────────
// Lightweight, non-cryptographic. Used only to bucket events without
// storing raw IPs.
function hash(s) {
  let h = 5381;
  const str = String(s || '');
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (h >>> 0).toString(16);
}

module.exports = {
  normalizePhone: normalizePhone,
  isValidPhone: isValidPhone,
  detectBuyingIntent: detectBuyingIntent,
  hash: hash
};
