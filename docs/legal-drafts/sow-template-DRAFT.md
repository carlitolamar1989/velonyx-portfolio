# Statement of Work — TEMPLATE (DRAFT FOR ATTORNEY REVIEW)

**Velonyx Systems LLC** · admin@velonyxsystems.com · (877) 317-8643
**Draft date:** 2026-08-16 · **Status:** template; not in effect until approved. Fill every `[BRACKET]` per client.

**SOW # [NUMBER] — [CLIENT BUSINESS NAME] AI Front Desk**

This SOW is issued under the Master Services Agreement dated [DATE] between Velonyx Systems LLC ("Velonyx") and [CLIENT LEGAL NAME] ("Client") and incorporates its terms, including the Data Processing Agreement (Exhibit A) and Refund Policy (Exhibit B). Capitalized terms are defined in the MSA.

---

## 1. Summary

| | |
|---|---|
| Client business | [Trade name, industry, website if any] |
| Client contact | [Name, role, email, mobile] |
| Velonyx contact | Carlos Glover, admin@velonyxsystems.com, (877) 317-8643 |
| Plan | [ ] Essentials ($129/mo × 12, then $70/mo) · [ ] Growth ($229/mo × 12, then $150/mo) · [ ] Elite ($499/mo × 12, then $350/mo) — or pay year 1 in full: $1,400 / $2,400 / $5,200 |
| Add-ons selected | [None / AI Video add-on — USD 200 per month] |
| Target Go-Live | [DATE] (subject to Section 5) |
| Sensitive-data screen | Client confirms it is / is not a HIPAA-covered entity or business associate: [IS / IS NOT]. If IS, this SOW is not valid without the separate agreement referenced in MSA §13. |

## 2. Deliverables (what "done" looks like)

### 2.1 Branded website
- One custom-branded site on Client's domain (Client-owned domain; Velonyx configures DNS/SSL) with: [home / services / about / contact / booking — list pages, typically 1–5].
- Mobile-first, HTTPS, hosted on Velonyx's Vercel account until Transfer.
- Embedded AI web-chat widget with SMS-consent checkbox (CTIA language) and AI disclosure.

### 2.2 AI assistant — channels enabled for this Client
Tick what is in scope. Each channel requires the Client inputs in Section 3.

| Channel | In scope | Notes |
|---|---|---|
| Web chat | [x] | Always included |
| SMS (two-way, text-back, confirmations, follow-ups) | [ ] | Requires toll-free verification or A2P 10DLC registration under Client's brand; carrier approval typically [X–Y] business days and outside Velonyx's control |
| Voice (AI answers calls, transcribes, books) | [ ] | Greeting discloses AI + transcription; number [new Twilio number / port Client's existing number] |
| Instagram DM | [ ] | Requires Client's Instagram professional account linked to a Facebook Page and Meta Business Manager access |
| Facebook Messenger | [ ] | As above |
| WhatsApp | [ ] | Requires WhatsApp Business account under Client's Meta Business portfolio |

Behavior on all channels: answers from Client's approved knowledge base; identifies itself as an AI in the first reply and when asked; qualifies leads one question at a time; offers real free slots and books them; sends SMS confirmation (if SMS in scope); hands off to a human when asked or when uncertain; honors STOP.

### 2.3 Booking
- Google Calendar integration on Client's calendar [calendar name / new booking calendar provisioned by Velonyx].
- Booking rules: services [list], durations [x min], buffer [x min], business hours [see 3.3], lead time [x hours], time zone [TZ].
- SMS confirmation at booking; reminders at [24h / 1h] before (SMS in scope required).

### 2.4 Follow-ups
- Automatic nudges to leads that go quiet: [sequence, e.g., 1h / 24h / 72h], within Meta's 24-hour window rules for DMs.
- Reactivation campaigns to Client's existing contact list are **available but off** until Client completes the consent attestation in the portal (MSA §5.4).

### 2.5 Owner portal
- Installable PWA; unified inbox across enabled channels; Take Over button; push notifications on new lead / booking; monthly plain-English report; campaign screen; subscription management (including **online cancel**).
- Owner allowlist: [owner emails].

### 2.6 Not included (unless added by change request)
- Additional pages beyond 2.1; copywriting beyond editing what Client supplies; logo design; paid ads; SEO content programs; custom integrations (CRM, POS, EHR); phone-system replacement beyond the AI line; multilingual voice ; anything in MSA §13 (sensitive data).

## 3. Client inputs (needed before the build clock starts)

| # | Input | Due |
|---|---|---|
| 3.1 | Brand assets: logo (SVG/PNG), colors, fonts if any, 5–10 photos | Kickoff + 2 business days |
| 3.2 | Business facts: legal name, trade name, address, service area, services and prices, policies (cancellation, deposits), FAQ answers | Kickoff + 3 business days |
| 3.3 | Business hours and holidays; booking rules (2.3) | Kickoff + 2 business days |
| 3.4 | Knowledge base review: Client reviews and approves the AI's answer set and greetings in writing before Go-Live | On delivery of preview |
| 3.5 | Access: Google account for calendar sharing; Meta Business Manager admin invite (if DMs/WhatsApp in scope); Twilio account or porting authorization (if bringing a number); domain registrar access or DNS records | Kickoff + 3 business days |
| 3.6 | Legal: Client's own privacy policy / terms for its site, or authorization for Velonyx to place Velonyx's standard client-site privacy notice (AI use, transcription, Velonyx as processor) | Before Go-Live |
| 3.7 | Consent posture: how Client currently collects SMS consent, and confirmation Client will only campaign to consented contacts | Before any campaign |
| 3.8 | Owner emails for the portal allowlist | Kickoff |

Delays in Client inputs extend the timeline day-for-day. If inputs are more than 30 days late, Velonyx may pause the build; the build fee remains non-refundable per the Refund Policy, and the project resumes when inputs arrive.

## 4. Fees

| Item | Amount | Due |
|---|---|---|
| Monthly price (months 1–12) | USD [129 / 229 / 499] / month, comprising Build Portion USD [59 / 79 / 149] + Service Portion USD [70 / 150 / 350] — OR pay year 1 in full: USD [1,400 / 2,400 / 5,200] (2 months free; paid at once or in 3 monthly payments at 0%) | First charge at Go-Live; then monthly on the same calendar day |
| Monthly price (month 13 onward) | USD [70 / 150 / 350] / month, month to month (or 10 months' price for a prepaid year) | — |
| Early cancellation (months 1–12) | Unpaid Build Portion balance = USD [59 / 79 / 149] × months remaining; no other fee | Within 15 days of cancellation |
| Add-on(s) | USD 200 / month (AI Video) · Founders' Offer (first 2 clients, Growth/Elite): [ ] yes — 50% off months 1–6 + AI Video included, case study + testimonial in return | From the month enabled |
| Included usage | [per plan — conversations / SMS segments / voice minutes per month]. Above that: [ ] pause at daily cap and alert (default) · [ ] pass through at cost + 20% on next invoice | — |
| Change requests | USD 95 / hour, quoted before work | Per change request |

Third-party accounts in Client's name (domain registration, Meta, and after Transfer: hosting, database, telephony, AI usage) are Client's cost.

## 5. Timeline

Target: **[N] business days from "build start"** (build fee received **and** inputs 3.1–3.3, 3.5, 3.8 received).

| Milestone | Target |
|---|---|
| Kickoff call; inputs collected | Day 0 |
| Instance stamped; site + knowledge base preview link | Day [3] |
| Client review round 1 (feedback within 3 business days) | Day [3–6] |
| Channels connected; test conversations; review round 2 | Day [6–9] |
| Go-Live checklist (Section 8) complete; switch on | Day [10] |

Carrier (A2P/toll-free) and Meta approvals are external and may land after Go-Live; the affected channel goes live when approved. Go-Live is not delayed for them unless Client requests.

## 6. Acceptance

The build is accepted when **all** of the following are demonstrated on a call or in a written test log and Client confirms by email — or 7 days after Velonyx delivers the go-live report with no written objection:

1. Site loads on Client's domain over HTTPS on phone and desktop.
2. On each in-scope channel: a test message gets an AI reply that identifies itself as an AI; the AI answers 3 sample questions correctly from the knowledge base; the AI books a real test slot that appears on Client's Google Calendar; a confirmation SMS is received (if SMS in scope).
3. Voice (if in scope): a test call is answered, the greeting discloses AI + transcription, and the transcript appears in the portal.
4. Portal: Client logs in on their phone, sees the test conversation, uses Take Over, receives a push notification.
5. STOP test: replying STOP suppresses further texts.
6. Smoke test script passes on all subsystems.

Cosmetic preferences after acceptance are change requests, not defects. Defects (deliverable does not do what this SOW says) are fixed at no charge.

## 7. Revisions and change requests

- Two consolidated review rounds are included during the build (Section 5). Additional rounds before Go-Live, or scope changes at any time, are change requests at the Section 4 rate, quoted before work.
- After Go-Live, Client edits business facts, hours, prices, and FAQ answers directly in the portal at no charge; structural changes (new pages, new channels, new integrations) are change requests.
- Enabling an additional channel later: included if it is part of Client's plan; otherwise upgrade to the plan that includes it (build-fee difference + new monthly rate), or USD 150 one-time for a single extra channel where offered.

## 8. Go-Live checklist (Velonyx completes; Client sees the result)

- [ ] Owner allowlist created; public sign-ups disabled on the Instance's auth
- [ ] Webhook signature verification confirmed on Twilio and Meta endpoints
- [ ] Spend caps set (AI tokens, SMS/day) and alert email set to Client + Velonyx
- [ ] AI + transcription disclosure present in every greeting variant
- [ ] STOP/HELP handling tested; suppression list active
- [ ] Web-chat SMS consent checkbox present and required
- [ ] Knowledge base approved by Client in writing (3.4)
- [ ] Sensitive-data instruction in the prompt: AI redirects health/financial/child details rather than collecting them
- [ ] Client's site privacy notice mentions AI, transcription, and processing by Velonyx and its subprocessors (3.6)
- [ ] Calendar booking round-trip verified; time zone correct
- [ ] Portal cancel path visible to Client
- [ ] Monthly report scheduled; first report date [DATE]
- [ ] Backup/export path verified (Client Data exportable from portal)

## 9. Special terms

[None / client-specific — e.g., bring-your-own Twilio number, additional owner seats, custom greeting script, staged channel rollout.]

## 10. Signatures

By signing, Client agrees to this SOW under the MSA and confirms the sensitive-data screen in Section 1.

**Velonyx Systems LLC** — ______________________ Carlos Glover, Founder — Date ________
**[CLIENT LEGAL NAME]** — ______________________ Name / Title — Date ________
