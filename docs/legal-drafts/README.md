# Velonyx Systems — Legal Documents v2 (reviewed 2026-08-16)

**Status:** v2 — every open question from the first pass has been resolved and applied (see `REVIEW-plain-english.md` for the reasoning, clause by clause). Reviewed by Claude at Carlos's direction in lieu of outside counsel; not legal advice from a licensed attorney. **Not yet published** — the live `terms.html` / `msa.html` / `sow.html` / `refund-policy.html` still describe the retired web-design business and must be replaced with these on Carlos's go.

## What is in this folder

| File | What it is | Replaces |
|---|---|---|
| `terms-of-service-DRAFT.md` | Website terms of use + customer terms (subscription, fees, cancellation, refunds, AI disclaimers, ownership at month 12) | `terms.html` |
| `msa-DRAFT.md` | Master Services Agreement for business clients (signed per client) | `msa.html` |
| `sow-template-DRAFT.md` | Fill-in Statement of Work for a $700 build | `sow.html` |
| `dpa-DRAFT.md` | Data Processing Agreement / CCPA service-provider addendum, with subprocessor list | (none existed) |
| `refund-policy-DRAFT.md` | Short refund policy aligned with the above | `refund-policy.html` |
| `ownership-explainer.md` | Plain-English "what you own it means" page (public) | `ownership.html` |
| `continuity-plan.md` | INTERNAL business-continuity plan (backup key-holder, steps, client register) — sign and keep with records; not published | — |

`privacy.html` was already rewritten on 2026-08-15 and is the reference these drafts are kept consistent with (processor list, roles, retention, "you are talking to an AI").

## The business these drafts describe

- **Velonyx Systems LLC**, San Diego / Chula Vista, California. Founder Carlos Glover. admin@velonyxsystems.com, (877) 317-8643, velonyxsystems.com. Sells worldwide.
- **Product:** a done-for-you "AI front desk" — branded website + AI that answers on web chat, SMS, voice calls (AI voice agent with transcription), Instagram DM, Facebook Messenger, WhatsApp; qualifies leads; books on the owner's Google Calendar; SMS confirmations; automatic follow-ups; owner portal (PWA) with unified inbox, Take Over, push notifications, monthly report.
- **Pricing:** three plans — Essentials $700 build + $70/mo · Growth $900 + $150/mo · Elite $1,200 + $400/mo — plus an AI Video add-on at $200/mo; annual prepay = 10 months' price. Included-usage allowances per plan. Billing is not live (funnel is book-a-call).
- **Ownership promise:** after 12 consecutive paid months the client owns their instance (repo, Supabase project, config) per `velonyx-platform/velonyx-template/HANDOFF.md`. Velonyx keeps the master template and know-how; the client gets a perpetual license to their stamped copy.
- **Data roles:** Velonyx is a processor/service provider for clients' end-customer data; controller for its own site visitors.
- **Sensitive data:** no HIPAA BAAs; no PHI, data of minors, or other sensitive categories without a separate written agreement.

## Decisions made in v2 (details in REVIEW-plain-english.md)

Governing law California; **Terms** use binding individual arbitration + class waiver with small-claims carve-out and 30-day opt-out; **MSA** uses San Diego courts + class waiver + CISG exclusion. Liability cap = 12 months' fees, **3× enhanced cap** for Velonyx data-security breach, uncapped indemnities/confidentiality/fraud. Month-12 transfer = assignment of the instance + perpetual non-exclusive license to embedded template; clock **pauses** on lapse; paid-up required. EU/UK **not offered** for now (no SCCs). HIPAA-covered entities **not onboarded** for now. Cancellation online (portal button or email), end of period, no proration; California renewal-law disclosures built in. Refund: 48h pre-kickoff full refund (fees absorbed), non-refundable after kickoff. Subprocessor change notice 30 days. Change requests $95/hr.

## What changed vs. the live pages

| Topic | Live page (stale) | Draft |
|---|---|---|
| Business described | "web design, development, payment integration" with Starter/Growth/Premium packages | AI front desk platform: site + AI on chat/SMS/voice/DM + booking + portal |
| Price | 50% deposit / 50% on completion; care plans $125/$225/$325 (terms) or $70/$150/$400 + $200 AI Video (refund page) | Essentials $700 + $70/mo · Growth $900 + $150/mo · Elite $1,200 + $400/mo · AI Video $200/mo — matches the homepage and the platform code |
| Financing | Klarna / Afterpay / Affirm, 10% pay-in-full discount | Removed (nothing live). Placeholder for when Stripe goes live |
| Refunds | 48-hour full refund; 4-phase tiered refund; kill fees 50/75/100% | 48-hour pre-kickoff refund; build fee non-refundable once work starts; monthly fee no proration; 30-day paid-service-not-delivered remedy |
| Cancellation | 30 days written notice (terms) / email only | Online cancel (portal button or email); effective end of period; renewal-law disclosures, annual reminder, 30-day price-change notice |
| Ownership | MSA 5.2–5.3: Velonyx owns platform architecture; license ends on cancellation; data deleted after 90 days | Client owns its data and content always; after 12 consecutive paid months the instance (repo, database, config) is transferred and licensed perpetually; template stays Velonyx's |
| Data protection | One paragraph; no DPA; "AWS Cognito, Lambda, DynamoDB" | Full DPA with 12 subprocessors, security measures, breach notice, deletion/return within 30 days |
| AI | Not mentioned | AI disclosure, transcription notice, no professional advice, may be wrong, human takeover, client responsibility for lawful messaging (TCPA/CTIA, call recording, AI-disclosure laws) |
| Sensitive data | MSA 12.5 (good clause, buried) | Kept and made prominent in Terms, MSA, DPA, SOW |
| Revisions | 2–5 rounds, $100/hr after window; 30% rush | 2 review rounds during build; change requests at $95/hr |
| Liability cap | Fees paid in preceding 3 months | Fees paid/payable in preceding 12 months; 3× for Velonyx data-security breach; standard carve-outs |
| Termination | 14 days notice; static export; premium features cease; data archived 90 days then deleted | End of billing period; 30-day transition window for export/transfer; deletion after |

## What's left

- Carlos says "publish" → Claude converts v2 into the styled site pages and replaces the four live legal pages.
- Build before Stripe goes live: portal Cancel button, annual reminder email, checkout renewal-consent checkbox + acknowledgment email.
- Carlos (5 min): opt out of model-improvement programs in the Deepgram and ElevenLabs dashboards.
