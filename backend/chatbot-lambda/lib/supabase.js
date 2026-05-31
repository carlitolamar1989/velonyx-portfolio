/**
 * Supabase REST client — service-role only.
 *
 * Uses PostgREST endpoints under /rest/v1/. Bypasses RLS because the
 * service_role key is privileged. Never expose this to the browser.
 *
 * Required env vars:
 *   SUPABASE_URL              https://<project>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY <secret from Supabase → Settings → API>
 */
const http = require('./http');

const URL  = process.env.SUPABASE_URL || '';
const KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function configured() {
  return Boolean(URL && KEY);
}

function headers(extra) {
  return Object.assign({
    'apikey':         KEY,
    'Authorization':  'Bearer ' + KEY,
    'Content-Type':   'application/json'
  }, extra || {});
}

// ── Leads ────────────────────────────────────────────────────────────────────
async function insertLead(record) {
  if (!configured()) throw new Error('supabase not configured');
  const res = await http.post(URL + '/rest/v1/leads', {
    headers: headers({ 'Prefer': 'return=representation' }),
    body: [record]
  });
  if (res.status >= 300) throw new Error('supabase insertLead ' + res.status + ': ' + res.raw);
  return Array.isArray(res.body) ? res.body[0] : res.body;
}

async function findLeadByPhone(phone) {
  if (!configured()) throw new Error('supabase not configured');
  const q = '?phone=eq.' + encodeURIComponent(phone) + '&order=created_at.desc&limit=1';
  const res = await http.get(URL + '/rest/v1/leads' + q, { headers: headers() });
  if (res.status >= 300) throw new Error('supabase findLeadByPhone ' + res.status + ': ' + res.raw);
  return Array.isArray(res.body) && res.body[0] ? res.body[0] : null;
}

async function updateLead(id, patch) {
  if (!configured()) throw new Error('supabase not configured');
  const res = await http.patch(URL + '/rest/v1/leads?id=eq.' + encodeURIComponent(id), {
    headers: headers({ 'Prefer': 'return=representation' }),
    body: patch
  });
  if (res.status >= 300) throw new Error('supabase updateLead ' + res.status + ': ' + res.raw);
  return Array.isArray(res.body) ? res.body[0] : res.body;
}

// Append a single turn to the conversation_log JSONB array.
// Reads, mutates, writes. Acceptable for low contention; revisit if races appear.
async function appendTurn(id, turn) {
  if (!configured()) throw new Error('supabase not configured');
  const q = '?id=eq.' + encodeURIComponent(id) + '&select=conversation_log';
  const fetched = await http.get(URL + '/rest/v1/leads' + q, { headers: headers() });
  if (fetched.status >= 300) throw new Error('supabase appendTurn read ' + fetched.status + ': ' + fetched.raw);
  const current = (Array.isArray(fetched.body) && fetched.body[0] && fetched.body[0].conversation_log) || [];
  current.push(turn);
  return updateLead(id, { conversation_log: current });
}

module.exports = {
  configured: configured,
  insertLead: insertLead,
  findLeadByPhone: findLeadByPhone,
  updateLead: updateLead,
  appendTurn: appendTurn
};
