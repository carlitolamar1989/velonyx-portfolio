# Velonyx Systems — Business Continuity Plan (internal, keep with your will/records)

**Version 1 · 2026-08-16 · Owner: Carlos Glover**
**Purpose:** if Carlos cannot run Velonyx — illness, accident, death, or simply deciding to stop — every client keeps their AI front desk, and someone Carlos trusts hands each client their own system within 30 days. Written in plain English so a non-technical person can follow it with a developer's help.

---

## 1. The one-paragraph version

Each client's system runs on rented cloud services that charge Velonyx's card monthly. Nothing needs Carlos daily. If Carlos is gone, the **Backup Key-Holder** (named below) opens the password vault, keeps the cards paying while they work through the client list, and hands each client their system by following the written Handoff procedure (`velonyx-template/HANDOFF.md`) — one call per client, about an hour each — or hires the Standby Developer to do it. Clients were promised this in their contract (Terms §12A / MSA §6.9), so it is an obligation, not a favor.

## 2. People

| Role | Name | Contact | What they hold |
|---|---|---|---|
| Owner | Carlos Glover | admin@velonyxsystems.com · (877) 317-8643 | Everything |
| **Backup Key-Holder** | ______________________ | ______________________ | Emergency access to the password vault (see §3); this document; authority to act for Velonyx Systems LLC in a continuity event (add them to the LLC operating agreement or give a limited power of attorney — ask an attorney/notary; that is the one legal step in this plan) |
| **Standby Developer** | ______________________ (any freelance web developer comfortable with Next.js/Vercel/Supabase; can be hired later — list two names or a marketplace) | ______________________ | Nothing until asked; paid hourly from Velonyx's account to perform handoffs |

Fill these in, print, sign, and give a copy to the Backup Key-Holder. Review every 6 months.

## 3. Where the keys are

- **Password vault:** ______________________ (e.g., 1Password / Apple Passwords / Bitwarden). Emergency access for the Backup Key-Holder is set up inside the vault app ("Emergency Kit" / "Emergency access" feature) — do this now; it takes 10 minutes.
- **The vault contains, per client:** the client folder name, the GitHub repository, the Supabase project, the Vercel project, the Twilio number and account, the Google service account, the Meta app, the client's owner email, and the `.env.local` values.
- **The manuals live in the code:** `velonyx-platform/velonyx-template/RUNBOOK.md` (how a system is set up and run) and `HANDOFF.md` (how to hand one over). They are also in the GitHub repository `carlitolamar1989/velonyx-platform-template`.
- **The client list:** Stripe dashboard (who pays what) + the folder `velonyx-platform/clients/` (one folder per client) + this document's appendix.

## 4. What to do — step by step for the Backup Key-Holder

**Week 1 — keep the lights on**
1. Open the vault. Log in to Stripe, Vercel, Supabase, Twilio, Anthropic, Google Cloud, Meta, GitHub, Resend, Fly.io. Confirm each has a working payment card; if Carlos's card will stop, replace it with the LLC's or your own and keep receipts (Velonyx reimburses).
2. Email every client (template in §6): their system is running; what happens next; expected timeline.
3. If you are not technical, hire the Standby Developer now (budget: about 2–4 hours per client at market rates).

**Weeks 2–4 — hand each client their system**
4. For each client, book a one-hour call and follow `HANDOFF.md` top to bottom: transfer the code, transfer the database, move hosting to the client's account, hand over calendar and phone number, move the Meta app, rotate every key while they watch, run the smoke test, remove Velonyx's login.
5. Clients still inside their first 12 months are handed over **at no charge and with no build balance owed** — the contract's continuity clause waives it.
6. Give each client the "you now own it" checklist (§7) and the names of two developers who can maintain it.

**After — wind down or continue**
7. Once every client is handed over: cancel Velonyx's cloud subscriptions, close the Twilio numbers that were Velonyx's own, keep the master template repository (it is the company's asset), and keep records for 7 years.
8. If instead the Backup Key-Holder wants to continue the business, nothing needs handing over — they simply become the operator; the manuals are enough to onboard a developer.

## 5. What clients own already (so nobody can take it from them)

Their web address (domain), their phone number, their Facebook/Instagram/WhatsApp, their Google Calendar, and every customer conversation and booking. Velonyx never owns those; it only operates them.

## 6. Email template to clients (send in Week 1)

> Subject: Your AI front desk — continuity update
> Hi [Name] — I'm [Backup Key-Holder], [relationship] at Velonyx Systems. Carlos is unable to continue running Velonyx. Your AI front desk is running normally and will keep running. Under your agreement, your system is yours — code, data, phone number, everything — and I will hand it to you, at no charge, within 30 days. I'll be in touch within [X] days to schedule a one-hour handover call. If you'd rather have a developer of your choice receive it, send me their contact. Questions: [email/phone].

## 7. Client "you now own it" checklist (give at handover)

- [ ] Your GitHub account holds the code · [ ] Your Supabase account holds the database (billing on your card) · [ ] Your Vercel account hosts the site (billing on your card) · [ ] Your Twilio account holds the number · [ ] Your Google account holds the calendar and service account · [ ] Your Meta portfolio holds the app · [ ] Your Anthropic account holds the AI key · [ ] Every password rotated; Velonyx removed · [ ] Smoke test passed on your deployment · [ ] Two developer contacts for maintenance · [ ] Monthly bills to expect: roughly $30–60.

## 8. Appendix — client register (update at every new client)

| Client | Plan | Started | Owner email | Where the number lives | Notes |
|---|---|---|---|---|---|
| Velonyx Systems (own) | Elite | 2026-08 | admin@velonyxsystems.com | Twilio (Velonyx) | flagship |
| Benjamin Lewis (demo) | Growth | 2026-08 | admin@velonyxsystems.com | — | demo instance |
| | | | | | |

Signed: ______________________ (Carlos Glover) Date: ________
Acknowledged: ______________________ (Backup Key-Holder) Date: ________
