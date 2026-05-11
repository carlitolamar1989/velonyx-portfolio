# Velonyx Universal Hero Repositioning (2026-05-07)

## Summary

Same-day corrective repositioning of `velonyxsystems.com`. Earlier on 2026-05-07 the homepage was repositioned to lead with **home service operators** in the hero ("Stop Juggling Tools. Start Running a Business." with HVAC/plumbing/electrical/garage doors in the eyebrow). The insight that drove this second pass: **specialize in fulfillment, generalize in pitch**.

The old hero filtered out non-home-service prospects (a dentist, a med spa owner, an e-commerce founder reads it and bounces). The new hero speaks to any ambitious business owner. Home service is named as the **specialty** further down the page — not the headline. Garage Door Kings remains the live portfolio proof.

The page now tells two stories at once:
1. We build for any ambitious business
2. Home service is our current specialty and here's the live proof

That's the more powerful version of this brand.

---

## Old positioning (deprecated, see `docs/REPOSITIONING_2026-05-07.md` for the full diff that introduced it)

- Eyebrow: "FOR HOME SERVICE OPERATORS — HVAC, PLUMBING, ELECTRICAL, GARAGE DOORS"
- H1: "Stop Juggling Tools."
- H2 (gold): "Start Running a Business."
- Supporting paragraph led with home-service-only language
- Pricing eyebrow: "First 5 Home Service Operators"
- Footer subtagline: "Premium digital systems built for home service operators."

## New positioning (this commit)

- **Eyebrow:** "PREMIUM DIGITAL SYSTEMS FOR AMBITIOUS BUSINESSES"
- **H1:** "The System / Your Business" (two `.line` spans, white)
- **H2 (gold):** "Has Been Waiting For." (single `.line.gold` span — the payoff lands here)
- **Gold sub-headline (between H2 and supporting paragraph):** "One platform. Built for you. Owned by you."
- **Previous wording (kept here for rollback reference):** H1 "Built for Businesses Ready to" / H2 (gold) "Look and Operate at the Next Level." — replaced because the dependent-clause split and the "next level" cliché didn't land. Same dual-promise spirit; the relief-framing version reads better out loud.
- **Supporting paragraph:** "Velonyx engineers premium digital systems for businesses ready to elevate their brand and run more efficiently — custom websites, integrated payments, customer dashboards, and automation tools, all connected, all owned. We specialize in home service operators (HVAC, plumbing, electrical, garage doors), with custom builds available for any business ready to scale."
- **Pricing eyebrow:** "Founding Member Pricing — First 5 Customers Only"
- **Footer subtagline:** "Premium digital systems built for ambitious businesses."

## Voice rules

- Hero language is universal: "ambitious businesses," "ready to grow," "look and operate at the next level."
- Home service appears as the **named specialty** in supporting copy, comparison block, portfolio sub-heading, pricing secondary link, and FAQ — never in the hero or top section headings.
- Operator voice. No tech jargon. No corporate speak.
- Surface "Owned by you. No rent. No lock-in." wherever it fits.
- Always close pages with "Your Legacy, Engineered With Precision."

---

## Where home service still shows up

1. **Hero supporting paragraph** — one sentence: "We specialize in home service operators (HVAC, plumbing, electrical, garage doors), with custom builds available for any business ready to scale."
2. **Comparison block intro** — "Here's what that stack typically costs a home service business:" (the math is sharpest in this vertical, so it anchors the comparison)
3. **Portfolio sub-heading** — "Garage Door Kings — Las Vegas. A live operator running on the Velonyx platform. The same system we build for any business ready to scale, with home service operators (HVAC, plumbing, electrical, garage doors) as our current specialty."
4. **Pricing card secondary link** — "Outside our home service specialty? We build custom for any business ready to scale. Book a consultation →"
5. **FAQ entry** — "Is Velonyx only for home service businesses?" / "No. Velonyx engineers custom digital systems for any ambitious business — we just specialize in home service operators (HVAC, plumbing, electrical, garage doors) because that's where the platform hits the deepest pain. Custom builds are available for businesses in any industry ready to scale, brand out, and own their infrastructure."

---

## What changed on the site

### `index.html`

- **Hero**
  - Eyebrow: "Premium Digital Systems for Ambitious Businesses"
  - H1: "The System / Your Business" (two `.line` spans, white)
  - H2 (gold): "Has Been Waiting For." (single `.line.gold` span)
  - **Same-day follow-up note:** the H1/H2 were briefly "Built for Businesses Ready to" / "Look and Operate at the Next Level." before being replaced with the current relief-framing version. Same dual-promise spirit, sharper read. See the rollback note higher in this doc.
  - **NEW** `.hero-subheadline` element below H2: "One platform. Built for you. Owned by you." (gold gradient text, fade+slide-up reveal triggered after H2 char animation, before button spring-in)
  - Supporting paragraph rewritten for universal positioning with home service named as one-clause specialty
  - CTAs unchanged: "Book a Consultation" / "See Pricing"
- **Problem / hook section** — rewritten in universal operator voice ("Bookings in one app. Payments in another. Customer data in a spreadsheet. Marketing in your DMs.") No longer leads with home service vertical names.
- **Services**
  - Section heading: "ONE PLATFORM. EVERYTHING YOUR BUSINESS NEEDS TO RUN."
  - Subhead: "Stop stitching software together. One system. One bill. One brand. All yours."
  - Card 1 copy tightened: "branded entirely as you"
  - Card 4 renamed "Job & Invoice Tracking"
- **Comparison block**
  - Eyebrow: "Own It. No Rent. No Lock-In."
  - Heading: "Stop Renting. Start Owning."
  - Intro: "Most operators are paying four to six different software companies every month — and at the end of three years, they don't own any of it. Here's what that stack typically costs a home service business:" (universal premise; home service named in the math context as the anchor)
  - Closing line: "Stop renting your business tools. Start owning your infrastructure."
- **Pricing card**
  - Eyebrow: 🏆 "Founding Member Pricing — First 5 Customers Only"
  - Sub-heading: "Built for businesses ready to grow, brand out, and own their infrastructure."
  - Section subtitle: "One platform. Five founding spots. Locked-in pricing for life."
  - Secondary link: "Outside our home service specialty? We build custom for any business ready to scale. Book a consultation →"
  - Pricing amounts ($3,000 + $100/mo, locked for life) unchanged
- **Portfolio**
  - Sub-heading: "Garage Door Kings — Las Vegas. A live operator running on the Velonyx platform. The same system we build for any business ready to scale, with home service operators (HVAC, plumbing, electrical, garage doors) as our current specialty."
  - Followup line: "More builds in production. Yours could be next."
- **FAQ + FAQPage schema**
  - Top FAQ replaced: "Is Velonyx only for home service businesses?" / "No. Velonyx engineers custom digital systems for any ambitious business — we just specialize in home service operators (HVAC, plumbing, electrical, garage doors) because that's where the platform hits the deepest pain…"
- **Meta + structured data**
  - Title: "Velonyx Systems — Premium Digital Systems for Ambitious Businesses"
  - Meta description, OG, Twitter rewritten for ambitious businesses with home service named as specialty
  - Keywords reordered: universal terms first, trade-specific terms retained for SEO
  - ProfessionalService description, serviceType (Custom Digital Platform first), Founding Member Offer description rewritten
  - WebSite schema description rewritten
  - Founding Member Service schema reframed; serviceType becomes "Custom Digital Platform"
- **Footer subtagline:** "Premium digital systems built for ambitious businesses."

### Supporting pages

- **`checkout.html`** — Eyebrow drops "For Home Service Operators"; subhead "first 5 customers only"; tier tag "First 5 Customers Only"; step 2 of "what happens next" reframed for any business with hero echo; footer subtagline; schema description.
- **`financing.html`** — Page label "Flexible Payments"; meta + OG + WebPage schema reframed for ambitious businesses; calculator footnote acknowledges builds outside the home service specialty; footer subtagline.
- **`book.html`** — Page label "Free Consultation"; subtitle reframed (universal lead, home-service specialty named in trailing clause); footer subtagline.
- **`connect/index.html`** — Footer line + meta + OG: "ambitious businesses".

---

## What did NOT change

- **Pricing:** $3,000 one-time + $100/mo, first month free, locked for life, first 5 founding customers
- **Stripe Payment Link:** `https://buy.stripe.com/7sYfZjajz5Kq9M2bKOcs80e`
- **Brand motto:** "Your Legacy, Engineered With Precision."
- **Brand voice tone:** premium, operator-direct, no tech jargon
- **Architecture decisions:** Next.js + Supabase + Vercel for the portal; AWS Cognito + Lambda + Terraform learning lab; GitHub Pages for marketing site
- **Founding spots counter:** still 5 dots on `index.html` and `checkout.html`
- **Live testimonial roles:** Marcus J. (Garage Door Operator, Las Vegas NV), Tanya S. (HVAC Operator, Atlanta GA), David R. (Plumbing Operator, Dallas TX) — left in place because they support the home service specialty story without overpowering the universal hero
- **Comparison block math** — left intact ($250–400+/mo rented vs $6,600 owned over 3 years); the home-service framing in the intro keeps the math sharpest in the named specialty
- **Deprecated tier markup preserved as commented-out rollback paths** — none deleted

---

## Rollback notes

If we need to roll the hero back to the home-service-led version:
1. The full home-service-led copy and structured data live in commit `715a989` on `main` (the prior PR #6 merge) and on the closed branch `claude/reposition-velonyx-home-services-gkgzz`.
2. The previous `docs/REPOSITIONING_2026-05-07.md` documents that pivot in detail and remains intact in this repo.
3. None of these changes touch the Stripe Payment Link, the founding-spots counter, the testimonials, or the architectural decisions docs.

---

*Repositioned: 2026-05-07 (same-day corrective pivot). Branch: `feat/universal-hero-repositioning`. Live target: `velonyxsystems.com` via GitHub Pages auto-deploy.*
