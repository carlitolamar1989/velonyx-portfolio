# Velonyx Pricing — proposal v3 (2026-08-16)

**Status:** proposed to Carlos; not yet on the site. Service portions ($70 / $150 / $400) confirmed by Carlos. Everything else below is Claude's recommendation for approval.

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
3. **Pay in full, financed by a third party at checkout** — where Stripe offers it: **Affirm** (Essentials $1,400 → about $233/mo × 6 at 0% APR under Affirm's standard package; Growth $2,400 → ~$400 × 6 at 0%; Elite $5,200 → ~$867 × 6 at 0%, or 12/36 months with interest) or **Afterpay** (Essentials: 4 × $350 interest-free; Growth: 6/12-month installments; Elite is over Afterpay's $4,000 cap). Terms, approval, and rates are Affirm's/Afterpay's; Velonyx is paid in full up front by Stripe.

**Caveat (verified in Stripe's docs 2026-08-16):** Affirm and Afterpay both list "B2B" as a prohibited business model on Stripe and reserve post-activation review. It's enabled on the account, so it may work case by case — but the site should say "may be offered at checkout," never promise it, and the monthly plan is the real financing story.

## 3. Founders' offer — first two clients only

**Elite at half price for six months, AI Video included.**
- Months 1–6: **$249/mo** (instead of $499) **+ AI Video add-on free** ($200/mo value)
- Months 7–12: $499/mo (video optional at $200)
- Month 13+: $400/mo — or take ownership
- Value: **$2,700 off** year 1. Standard 12-month term (build portion $99 if they leave early).
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
