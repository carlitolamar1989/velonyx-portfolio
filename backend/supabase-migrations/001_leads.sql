-- ============================================================================
-- Velonyx Unified AI Lead System — Initial Schema
-- ============================================================================
-- Run this in your Supabase project's SQL Editor (Dashboard → SQL Editor → New
-- query → paste → Run).
--
-- Creates one table: public.leads
-- Holds every lead captured from the chatbot, conversational form, or SMS reply.
-- Conversation log is JSONB so chat / form / SMS turns all stack into one record.
--
-- Security model: RLS is enabled. NO public policies are created intentionally —
-- the Lambda calls Supabase with the service_role key, which bypasses RLS.
-- Browser-side code never touches this table directly.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── leads table ──────────────────────────────────────────────────────────────
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  name            text,
  phone           text,
  email           text,
  interest        text,
  -- 'new' | 'sms_active' | 'booked' | 'closed' | 'stopped'
  status          text not null default 'new',
  -- 'chatbot' | 'form' | 'sms' | 'manual'
  source          text,
  -- Array of { role: 'user'|'bot'|'sms_user'|'sms_bot', text, ts, channel: 'chat'|'form'|'sms' }
  conversation_log jsonb not null default '[]'::jsonb,
  -- Free-form metadata: session_id, turn_count, session_duration_ms, user_agent_hash, ip_hash, etc.
  meta            jsonb not null default '{}'::jsonb,
  notified_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists leads_phone_idx       on public.leads (phone);
create index if not exists leads_status_idx      on public.leads (status);
create index if not exists leads_created_at_idx  on public.leads (created_at desc);
create index if not exists leads_source_idx      on public.leads (source);

-- ── auto-update updated_at ───────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ── RLS lockdown ─────────────────────────────────────────────────────────────
-- All access from server-side code only (Lambda → service_role key bypasses RLS).
-- No anon / authenticated policies created intentionally.
alter table public.leads enable row level security;

-- ── done ────────────────────────────────────────────────────────────────────
-- After running this migration, verify by running:
--   select count(*) from public.leads;     -- should return 0
--   \d public.leads                         -- describes the table
