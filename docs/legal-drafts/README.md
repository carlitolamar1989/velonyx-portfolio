# Velonyx Systems — Legal Drafts (FIRST PASS, NOT LIVE)

**Status:** Drafts for attorney review. Nothing in this folder is published, linked from the site, or in effect. Written 2026-08-16 from the business facts below; not legal advice.

**Do not** copy these into `terms.html` / `msa.html` / `sow.html` / `refund-policy.html` until a lawyer has signed off. The live pages still describe the retired web-design business and must be replaced, not patched (see table at the bottom).

## What is in this folder

| File | What it is | Replaces |
|---|---|---|
| `terms-of-service-DRAFT.md` | Website terms of use + customer terms (subscription, fees, cancellation, refunds, AI disclaimers, ownership at month 12) | `terms.html` |
| `msa-DRAFT.md` | Master Services Agreement for business clients (signed per client) | `msa.html` |
| `sow-template-DRAFT.md` | Fill-in Statement of Work for a $700 build | `sow.html` |
| `dpa-DRAFT.md` | Data Processing Agreement / CCPA service-provider addendum, with subprocessor list | (none existed) |
| `refund-policy-DRAFT.md` | Short refund policy aligned with the above | `refund-policy.html` |

`privacy.html` was already rewritten on 2026-08-15 and is the reference these drafts are kept consistent with (processor list, roles, retention, "you are talking to an AI").

## The business these drafts describe

- **Velonyx Systems LLC**, San Diego / Chula Vista, California. Founder Carlos Glover. admin@velonyxsystems.com, (877) 317-8643, velonyxsystems.com. Sells worldwide.
- **Product:** a done-for-you "AI front desk" — branded website + AI that answers on web chat, SMS, voice calls (AI voice agent with transcription), Instagram DM, Facebook Messenger, WhatsApp; qualifies leads; books on the owner's Google Calendar; SMS confirmations; automatic follow-ups; owner portal (PWA) with unified inbox, Take Over, push notifications, monthly report.
- **Pricing:** $700 one-time build + $70/month. Optional growth add-ons at $250 / $500 / $1,500 per month. Billing is not live (funnel is book-a-call).
- **Ownership promise:** after 12 consecutive paid months the client owns their instance (repo, Supabase project, config) per `velonyx-platform/velonyx-template/HANDOFF.md`. Velonyx keeps the master template and know-how; the client gets a perpetual license to their stamped copy.
- **Data roles:** Velonyx is a processor/service provider for clients' end-customer data; controller for its own site visitors.
- **Sensitive data:** no HIPAA BAAs; no PHI, data of minors, or other sensitive categories without a separate written agreement.

## Questions the lawyer must answer

Every `[LAWYER: …]` bracket in the drafts is a place where a legal judgment was needed and a placeholder or a proposed default was used. The big ones:

1. **Governing law and disputes.** Drafts use California law, San Diego County venue, 30-day negotiation then mediation. Sales are worldwide — is a mandatory arbitration clause with class waiver advisable for consumer-facing Terms? Any issue enforcing California venue against non-US buyers?
2. **Limitation of liability cap.** Drafts propose: fees paid in the 12 months before the claim (Terms and MSA), with a carve-out list (indemnities, confidentiality breach, gross negligence/wilful misconduct, and a separate cap for data-protection claims). Confirm the cap, the carve-outs, and whether a lower cap (e.g., 3 months, as in the old MSA) is preferable.
3. **Ownership transfer mechanics (month 12).** Is an assignment of the instance repository + Supabase project + config, plus a perpetual non-exclusive license to the template code embodied in that copy, the right structure? Does Velonyx need to retain any rights (bug-fix reuse, non-compete on reselling the copy)? What triggers the transfer if the client is in arrears at month 12, or cancels at month 11? Draft says: 12 consecutive paid months, transfer within 30 days of request, client covers third-party account costs.
4. **DPA adequacy for EU/UK buyers.** Draft includes CCPA service-provider language and a placeholder for EU/UK SCCs (Module 2, controller-to-processor) and the UK IDTA/Addendum. Since AI processing goes through US subprocessors (Anthropic, Twilio, etc.), what transfer mechanism and what representations are needed? Should Velonyx simply not sell to EU/UK controllers until a full DPA is in place?
5. **Cancellation and refunds.** Draft: online cancellation from the portal or by email, effective at end of the current billing period, no proration; build fee non-refundable once build work starts (48-hour window before kickoff). Confirm this satisfies California's automatic-renewal law (Bus. & Prof. Code 17600 et seq.) and consumer refund expectations for a mixed business/consumer audience worldwide.
6. **AI / TCPA allocation of liability.** Client is the sender/controller and indemnifies Velonyx for consent failures, call-recording consent, and unlawful use; Velonyx warrants it provides STOP handling, consent checkboxes, and AI/transcription disclosures. Is this allocation defensible given Velonyx configures and operates the sending infrastructure? Any state AI-disclosure or bot-disclosure statute (e.g., Cal. B&P 17940–17943; Utah, Colorado AI acts) that needs an explicit clause?
7. **HIPAA / sensitive-data carve-out.** Velonyx will not sign BAAs but markets to med-spas and health-adjacent businesses. Is the "no PHI without a separate written agreement" clause enough, or does Velonyx need to refuse HIPAA-covered entities entirely?
8. Also: independent-contractor / Freelance Worker Protection Act reference in the old MSA (keep or drop?), the "portfolio rights" clause, chargeback language, and whether the Terms can bind visitors who never click "I agree" (browsewrap vs. clickwrap).

## What changed vs. the live pages

| Topic | Live page (stale) | Draft |
|---|---|---|
| Business described | "web design, development, payment integration" with Starter/Growth/Premium packages | AI front desk platform: site + AI on chat/SMS/voice/DM + booking + portal |
| Price | 50% deposit / 50% on completion; care plans $125/$225/$325 (terms) or $70/$150/$400 + $200 AI Video (refund page) | $700 one-time build + $70/month; add-ons $250/$500/$1,500/mo. **Carlos:** the live homepage shows $700/$70, $900/$150, $1,200/$400 and a $200 AI Video add-on — one of these must be corrected before the lawyer finalizes |
| Financing | Klarna / Afterpay / Affirm, 10% pay-in-full discount | Removed (nothing live). Placeholder for when Stripe goes live |
| Refunds | 48-hour full refund; 4-phase tiered refund; kill fees 50/75/100% | 48-hour pre-kickoff refund; build fee non-refundable once work starts; monthly fee no proration; 30-day paid-service-not-delivered remedy |
| Cancellation | 30 days written notice (terms) / email only | Online cancel from portal or by email; effective end of current billing period; no notice period |
| Ownership | MSA 5.2–5.3: Velonyx owns platform architecture; license ends on cancellation; data deleted after 90 days | Client owns its data and content always; after 12 consecutive paid months the instance (repo, database, config) is transferred and licensed perpetually; template stays Velonyx's |
| Data protection | One paragraph; no DPA; "AWS Cognito, Lambda, DynamoDB" | Full DPA with 12 subprocessors, security measures, breach notice, deletion/return within 30 days |
| AI | Not mentioned | AI disclosure, transcription notice, no professional advice, may be wrong, human takeover, client responsibility for lawful messaging (TCPA/CTIA, call recording, AI-disclosure laws) |
| Sensitive data | MSA 12.5 (good clause, buried) | Kept and made prominent in Terms, MSA, DPA, SOW |
| Revisions | 2–5 rounds, $100/hr after window; 30% rush | 2 review rounds during build; changes after go-live via change request at a stated hourly rate [Carlos to set] |
| Liability cap | Fees paid in preceding 3 months | Fees paid in preceding 12 months, with carve-outs (lawyer to confirm) |
| Termination | 14 days notice; static export; premium features cease; data archived 90 days then deleted | End of billing period; 30-day transition window for export/transfer; deletion after |

## Open items that are Carlos's decisions, not the lawyer's

- Reconcile the homepage pricing tiers with the $700 + $70 + add-on model before the lawyer finalizes.
- Set the change-request hourly rate and support response targets used in the SOW.
- Decide whether to sell to HIPAA-covered entities at all (see question 7).
- Decide whether to sell to EU/UK controllers before the DPA's SCC section is complete (see question 4).
- Confirm the third-party account costs the client bears after transfer (Supabase ~$10/mo, Vercel, Twilio, Google Cloud, Anthropic usage) so the number in the MSA is honest.
