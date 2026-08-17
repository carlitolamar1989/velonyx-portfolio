# Velonyx Pricing — proposal v3 (2026-08-16)

**Status:** APPROVED by Carlos 2026-08-16 and LIVE on velonyxsystems.com (homepage #pricing, checkout, financing, JSON-LD), in `core/pricing.ts`, and in the SOW template. Changes from v3 proposal: Founders' Offer applies to **Growth and Elite**; Growth badged "Most popular"; annual 10-for-12 offered after year 1; **No third-party BNPL** — Affirm/Afterpay/Klarna exclude B2B and Stripe has no US B2B pay-later method as of Aug 2026 (Capchase Pay was withdrawn); financing is built in via Stripe: monthly plan, or annual price paid at once or in 3 monthly payments at 0% (Stripe subscription-schedule installments).

## The idea in one line
No big upfront fee. One monthly price for 12 months (the build is spread into it, 0% from Velonyx). After 12 payments the price drops to the service price — or take the system and go, it's yours. Pay the year up front and get two months free.

## 1. Plans

| | **Essentials** | **Growth** (most popular) | **Elite** |
|---|---|---|---|
| **Monthly, months 1–12** | **$129/mo** | **$229/mo** | **$499/mo** |
| — build portion | $59 | $79 | $99 |
| — service portion | $70 | $150 | $400 |
| **Month 13 onward** (or own it and leave) | **$70/mo** | **$150/mo** | **$400/mo** |
| **Pay year 1 in full — 2 months free** | **$1,400** (save $148) | **$2,400** (save $348) | **$5,200** (save $788) |
| Cancel early (months 1–12) | remaining build months × $59 | × $79 | × $99 |
| What's in it | Branded website · AI web chat · booking on your calendar + SMS confirmations · owner portal + monthly report · 300 AI conversations/mo | + two-way SMS AI · Instagram + Messenger DMs · automatic follow-ups · owner alerts · 1,000 conversations + 1,000 texts/mo | + AI voice agent that answers calls · WhatsApp · 1 AI video/mo · +500 voice minutes/mo |
| After year 1 | you own it | you own it | you own it |

- **Price lock:** the monthly rate never rises during the first 12 months.
- **Annual after year 1** (optional): 10 months' price for 12 ($700 / $1,500 / $4,000).
- **AI Video add-on:** $200/mo, standalone or on any plan (unchanged).
- **Single channel / custom (e.g., WhatsApp only, Facebook only, voice only):** contact Carlos for a quote. Internal floor so the packages stay the better deal: single messaging channel from **$199/mo**, voice-only from **$349/mo**, 12-month term, no ownership transfer on standalone channels. Say on the site: "Most businesses find a full plan is the better deal."

## 2. Ways to pay

1. **Monthly plan (default)** — Velonyx finances the build at 0% into 12 payments. Card on file via Stripe. This is the headline: *no upfront, no interest, own it in a year.*
2. **Pay in full** — 2 months free (~10–13% off). Card, Apple Pay, Google Pay.
3. **Annual in 3 payments** — same 2-months-free price split into three monthly card payments (Essentials 3 × $467 · Growth 3 × $800 · Elite 3 × $1,734), 0% interest, no credit check; implemented as a Stripe subscription that stops after 3 payments (Stripe's own recommended "installment plan" mechanism).

**Why no Affirm/Afterpay/Klarna (verified 2026-08-16):** all three prohibit B2B on Stripe; Stripe's current pay-later list has no US B2B method (Capchase Pay withdrawn; Billie/Mondu/Kriya are EU/UK only); off-Stripe B2B lenders (Credit Key, Resolve, Two) require wholesale volume. Business buyers who want outside financing can use a business credit card (0% intro offers) at checkout — we accept cards + ACH.

## 3. Founders' offer — first two clients only

**Growth or Elite at half price for six months, AI Video included.**
- Growth: months 1–6 **$114/mo** (instead of $229) · Elite: months 1–6 **$249/mo** (instead of $499) — **+ AI Video add-on free** ($200/mo value) for those 6 months
- Months 7–12: regular rate ($229 / $499); video optional at $200
- Month 13+: $150 / $400 — or take ownership
- Value: Growth **$1,890 off**, Elite **$2,700 off** year 1. Standard 12-month term (build portion $79 / $99 if they leave early).
- In return: a case study + testimonial + logo/portfolio permission, and 30-minute feedback call at month 3.
- Only 2 seats; goes away when both are signed. Handled personally by Carlos (no code on the site — "Ask about the Founders' offer").
- If a founder wants to pay in full: Carlos quotes (suggest $3,900).

## 4. Why these numbers (research, Aug 2026)

- **Market bands:** chat-only tools $39–99/mo; chat + SMS + DMs + booking $99–299/mo (Goodcall $79–249, GoHighLevel ≈$194 with AI Employee, My AI Front Desk $99, Dialzara $99–199); done-for-you with voice $297–997/mo (AgentZap $295–899 + $499 setup, Podium + AI ≈$500–800/mo on annual contracts, WildRun $497–997). Human receptionists $250–2,100/mo. Setup fees are uncommon (Birdeye $500–1,500, AgentZap $499).
- **Ownership:** no competitor transfers ownership — ever. That is the differentiator; keep it in the headline.
- **Annual discount norm:** ~2 months free (GoHighLevel, Podium, most SaaS: 10–20%). We match at 2 months.
- **Financing structure:** amortizing a setup fee into 12 payments with an early-exit balance equal to the unpaid build cost is standard and holds up in California for business customers (Civ. Code §1671(b) — the balance is real cost, not a penalty).
- **Our cost reality (live data):** ~11¢ per AI conversation + text; ~$12/mo fixed per client (database + number). Essentials clears ~$110/mo in year 1 and ~$55 after; Growth ~$200 / ~$130; Elite ~$430 / ~$330 before video time. Healthy at every tier.

## 5. Where this shows up once approved
Homepage `#pricing` (three cards + "ways to pay" strip + founders' callout), `checkout.html`, `financing.html` (Affirm/Afterpay described truthfully), JSON-LD offers, `core/pricing.ts` (buildUsd/monthlyUsd already aligned; add payInFull), SOW template numbers, `terms.html §10` example figures.
