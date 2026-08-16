# Contract Review — Plain English (v2, 2026-08-16)

**Who did this:** Claude, acting as your contract reviewer at your instruction ("act as my lawyer"). I benchmarked the drafts against the two open-source industry standards for software agreements (Common Paper Cloud Service Agreement, Bonterms Cloud Terms), California's automatic-renewal law as amended July 1 2025, the current TCPA / CCPA / AI-disclosure / call-recording rules, and typical IP-transfer language. Every open question in the first draft has now been resolved with a decision, and the decisions are already applied to the v2 drafts in this folder.

**One-time honesty note, then I'll stop saying it:** I am not a licensed attorney and this is not a substitute for one. These are sound, market-standard positions; a real lawyer could still tighten wording for your exact situation. You've decided to proceed without one — fine, and this is a much better place than the live pages are today.

---

## The five things that matter most (read these even if you skip the rest)

1. **Your live Terms/MSA/SOW/Refund pages are describing a business you no longer run.** They talk about web-design packages, 50% deposits, care plans at $125/$225/$325, kill fees, and — worst — the live MSA says *Velonyx owns everything and the client's license ends when they cancel*. Your website promises "you own it after 12 months." A judge reads the contract, not the marketing. **Fix: publish the v2 drafts.** They say the same thing your marketing says.

2. **The "you own it after 12 months" promise is structured correctly now.** After 12 paid months you *assign* the client their stamped copy (their repo, their database, their config) and give them a perpetual license to the template code inside it, while you keep the master template to sell to others. This is the standard "background IP vs. deliverables" structure every agency uses. Two decisions I made: (a) if a client falls behind, the 12-month clock **pauses** rather than resets (a hard reset looks like a penalty and invites a fight); (b) they can't resell your template as a product. Both are enforceable and fair.

3. **Your biggest real-world lawsuit risk is texting (TCPA), not your contract.** $500–$1,500 *per text* to a number without proper consent, no cap, class actions. The contract now makes crystal clear that **the client decides who gets a campaign, what it says, and when** — you provide the tooling (STOP handling, consent checkbox, suppression list). Under the FCC's test, the party who chooses recipients/content/timing is the "sender." Keeping that line bright is what keeps you out of the lawsuit. Operationally: never build a feature that lets *you* pick a client's recipients.

4. **California's renewal law (July 2025 amendments) is strict and I've built it into the Terms even though it technically covers consumers, not businesses** — because sole proprietors blur the line and the rules are cheap to follow: (a) show the renewal terms right next to a **separate checkbox** at checkout; (b) email a copy they can keep; (c) a **Cancel button in the portal** — no phone-call-required tricks; (d) an **annual reminder email**; (e) 30 days' notice before any price change. **Two build items for me before Stripe goes live:** the Cancel button and the annual reminder email don't exist yet.

5. **HIPAA: don't take medical, dental, or mental-health clients yet.** Even "just scheduling" for a doctor's office is health information under HIPAA, which would make you a Business Associate needing a signed BAA and a HIPAA-eligible stack (Anthropic, Twilio, Supabase, Vercel all have HIPAA options — at enterprise prices). The MSA now says plainly: no covered entities until that exists. Cosmetic/wellness businesses that don't bill insurance are fine, with the AI configured not to collect health details.

---

## Document-by-document

### Terms of Service (`terms-of-service-DRAFT.md`) — website visitors + customers

| Clause | My verdict | What I did |
|---|---|---|
| "You are talking to an AI" (Part A §2) | Good and now legally load-bearing. California's 2019 bot law only bites sites with 10M+ visitors, but Utah (disclose when asked), Maine (disclose on text *and* phone), Texas (within 30 seconds of a call) and Colorado (2027) all now expect it. | Made §15.3 specific: AI identifies itself at the **start of every call**, in the **first reply of every text/DM thread**, and **whenever asked**. Your greeting already does this. |
| Call transcription | Good. California is an all-party-consent state; an up-front announcement plus the caller staying on the line is treated as consent (*Kearney*, *Kight v. CashCall*). Live risk: 2025–26 class actions against AI-transcription vendors as "third-party eavesdroppers" (Otter.ai, Granola). | Your greeting says "AI assistant" + "transcribed" — that covers both the recording and the AI-processing disclosure. Don't shorten it. |
| Fees | Was one flat price + phantom "$250/$500/$1,500 add-ons." | Replaced with the three plans + AI Video add-on + **included-usage allowances** (see pricing section). Without allowances, a $70 client can run up unlimited AI/SMS cost on you. |
| Auto-renewal & cancellation | Was OK; now compliant with the 2025 amendments. | Separate consent, acknowledgment email, portal Cancel button, annual reminder, 30-day price-change notice. |
| Ownership at month 12 | Structure right. | Clock pauses (not resets); must be paid up at transfer; anti-resale clause; ~$15–40/mo third-party costs stated honestly. |
| Refunds | Fine for B2B. California only presumes penalties invalid in *consumer* contracts; for business buyers a non-refundable build fee tied to work actually started is standard. | 48-hour full refund before kickoff (we absorb card fees — cheaper than the goodwill hit); non-refundable after kickoff; no proration on the monthly. |
| Liability cap | Old MSA said 3 months of fees. Market (85% of Common Paper agreements, Bonterms default) is **12 months**. | 12 months paid-or-payable; **3× cap** if *Velonyx* breaches its data-security duties (Bonterms' "enhanced cap" — better than the uncapped exposure the first draft had); uncapped only for indemnities, confidentiality, fraud/gross negligence, and the client's payment obligation. |
| Client indemnifies you for texting/consent failures | Correct and market-standard. | Kept; added the "you choose recipients/content/timing" sentence and the 10-business-day rule for honoring revocations by any reasonable means (FCC rule, effective April 2025). |
| You indemnify client for IP infringement | Standard. | Added standard exclusions (their content, their modifications, third-party services) and your fix/replace/refund option. |
| Disputes | Was "courts in San Diego." | Changed to **binding individual arbitration (AAA) + class-action waiver**, small-claims carve-out, 30-day opt-out. This is the single best protection a one-person company has against a TCPA class action; it's routinely enforced under federal law, and the California-specific "public injunctive relief" carve-out is included so it isn't struck. |
| Website liability floor ($100) | Fine. | Added the "some jurisdictions don't allow…" saving language. |
| Portfolio use | Fine (opt-out). | Kept. |

### Master Services Agreement (`msa-DRAFT.md`) — signed per business client

- **Fees §4** rewritten to the three plans + allowances + the renewal disclosures. Late interest 1%/month is fine (12%/yr — well under anything problematic).
- **Shared credentials §2.2:** I stated the truth — some third-party accounts (AI key, Twilio, calendar service account) are shared across Velonyx-operated instances until transfer; client *data* is never commingled. Better to say it than have a client discover it. (Product note: per-client keys at onboarding would let you delete this sentence.)
- **Ownership §6:** as above. Transferred code is "as-is beyond the smoke test."
- **Data §7:** you don't train on client data. Anthropic's commercial API terms genuinely don't train on inputs/outputs. **Action for you (5 min):** in the Deepgram and ElevenLabs dashboards, find the "data / model improvement" setting and opt out, so the sentence I wrote ("Velonyx opts out of any model-improvement program the vendor offers") is true.
- **Sensitive data §13:** HIPAA rule as above; survival added.
- **Disputes §14:** business-to-business, so I kept **courts** in San Diego (arbitration is optional here), added a class-action waiver, CISG exclusion (you sell worldwide), and email service of process for foreign clients.
- Dropped the old Freelance Worker Protection Act / ABC-test recitals — Velonyx contracts as an LLC; they added nothing.

### Data Processing Agreement (`dpa-DRAFT.md`) — the missing piece the old site never had

- Now contains all ten CCPA service-provider clauses required by 11 CCR §7051 (no selling/sharing, specific purposes, no combining, same protection level, audit right, notice if you can't comply, cooperation on consumer requests, subcontractor flow-down, certification). Without these clauses in writing, you legally aren't a "service provider" for a California client — you'd be treated as a third party they *sold* data to. Big deal, now fixed.
- **Subprocessor list** (12 vendors, US regions filled in: Supabase Oregon, Fly.io Virginia); **30 days'** notice of changes (market; first draft said 15).
- **Security measures** are described exactly as built (RLS + owner allowlist, signature-verified webhooks, fail-closed secrets, spend caps, masked logs, daily backups 7 days). It states plainly you hold **no SOC 2 / ISO** — that honesty prevents a misrepresentation claim later.
- **Breach notice 72 hours** — standard.
- **EU/UK: I turned it off.** No Standard Contractual Clauses, no EU representative, US-only vendors → the DPA now says the Service is offered to clients *outside* the EEA/UK/Switzerland. Selling to Europe without SCCs is a GDPR exposure you don't need at this stage. Flip it on later with an amendment.
- **Deletion:** the portal's new "Delete a customer's data" tool makes §6.1/§8 true, not just promised. STOP records are kept (legally required).

### SOW template (`sow-template-DRAFT.md`)

- Plan checkboxes, allowance line with the pause-vs-passthrough election, **change requests at $95/hour** (my default — a fair agency rate for your level; change if you want), extra channel = upgrade plan or $150 one-time. Acceptance tests and a go-live checklist that mirrors the security fixes.

### Refund policy (`refund-policy-DRAFT.md`)

- Aligned to plans; absorb processor fees on the 48-hour refund; annual prepay refund rule added (14 days full, then unused whole months at monthly rate). Chargeback wording neutral.

---

## Things I decided that you can overrule (business calls, not legal ones)

| Decision | My pick | Why |
|---|---|---|
| First month free? | **No** — first charge at go-live | Simpler renewal disclosures, less revenue leakage; offer a discount on the call if you want a closer. |
| Monthly cancel proration | **None** | Standard; they keep service to period end. |
| Change-request rate | **$95/hr** | Market for a solo AI-systems shop; raise later. |
| Overage handling | **Pause at daily cap (default)**, passthrough at cost+20% if elected | Keeps you from ever eating a runaway bill. |
| Arbitration in Terms | **Yes, with opt-out** | TCPA class-action shield. |
| EU/UK sales | **Off for now** | No SCCs; nothing to gain yet. |
| HIPAA-covered clients | **No for now** | See item 5 above. |

---

## What still needs to happen (I do the building; you say "go")

1. **Publish** the v2 drafts over `terms.html`, `msa.html`, `sow.html`, `refund-policy.html` (I convert them to the site's styled pages). Until then the contradictory pages stay live.
2. **Build before Stripe goes live:** portal Cancel button; annual reminder email; checkout renewal-terms checkbox + acknowledgment email.
3. **You (5 min):** opt out of model-improvement in the Deepgram and ElevenLabs dashboards.
4. **Reconcile the pricing everywhere** — see the pricing decision below; I have already fixed the platform code ($197/$347/$497 was wrong and was inflating your margin report).
