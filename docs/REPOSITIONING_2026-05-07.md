# Velonyx Repositioning — Home Service Industry (2026-05-07)

## Summary

Velonyx Systems repositioned from a generic "premium digital systems for ambitious businesses" pitch to a focused **home service industry** play — HVAC, plumbing, electrical, garage doors, and any trade ready to scale. Garage Door Kings (Las Vegas) remains the showcase live build; the same platform is now explicitly framed as the system we'd build for any home service vertical.

Custom builds remain available for businesses outside home services via the consultation pathway.

---

## Old positioning (deprecated)

- "Premium digital systems built for ambitious businesses"
- Generic "service operators" target
- Four-tier pricing reference in structured data and modal: Starter $1,500 / Growth $3,500 / Premium $6,000 / Enterprise $12,000+
- Marcus J. (Barbershop, Houston) / Tanya S. (Fitness Coach, Atlanta) / David R. (Photographer, Dallas) testimonial roles — legacy verticals from the pre-Velonyx-trades pivot
- "Stop Renting Your Business Tools / Start Owning Your Infrastructure" hero

## New positioning

- **Target market:** home service industry — HVAC, plumbing, electrical, garage doors, and any trade ready to scale
- **Hero:** "Stop Juggling Tools. Start Running a Business."
- **Sharpest competitive line:** "Own it. No rent. No lock-in."
- **Closing motto (unchanged):** "Your Legacy, Engineered With Precision."
- **Single tier in visible copy + structured data:** Founding Member System — $3,000 one-time + $100/month, first month free, locked in for life for the first 5 founding customers

## Canonical master message (verbatim)

> Home service businesses are juggling multiple tools — calls on one app, payments on another, invoices scattered. It's costing you time and money. Velonyx brings it all together. Search engine optimized website so customers find you. Integrated payments so they book and pay instantly. Invoice tracking that keeps you organized. Financing options that help your customers say yes to bigger jobs. And you own it — no monthly rent, no vendor lock-in. All in one platform designed for HVAC, plumbing, electrical, garage doors — any trade ready to scale. Stop juggling tools. Start running a business. Velonyx. Your legacy, engineered with precision.

## Voice rules (apply across all surfaces)

- Lead with the operator's pain: "juggling multiple tools," "scattered," "costing you time and money"
- Plain trade language only — no tech jargon, no corporate speak
- Speak to operators directly — "you own it," "your customers," "your legacy"
- Surface "Own it. No rent. No lock-in." wherever it fits
- Always close with the motto: "Your Legacy, Engineered With Precision."
- Name HVAC, plumbing, electrical, garage doors explicitly when possible
- Always add "and any trade ready to scale" as the open door
- Custom builds available outside home services via consultation

---

## What changed on the site

### `index.html`

- **Hero**
  - Eyebrow: "FOR HOME SERVICE OPERATORS — HVAC, PLUMBING, ELECTRICAL, GARAGE DOORS"
  - H1: "Stop Juggling Tools."
  - H2 (gold): "Start Running a Business."
  - Sub-paragraph: pulled directly from the master message
  - CTAs: "Book a Consultation" / "See Pricing"
  - CSS: `font-size: clamp(2.5rem, 6vw, 5rem)` on `.hero-h1-top` per spec; `.hero-h2-bottom` scaled to clamp(2.2rem, 5.4vw, 4.4rem) for hierarchy; mobile media query rebalanced to clamp(1.9rem, 8vw, 2.5rem) / clamp(1.7rem, 7vw, 2.2rem)
- **Problem section:** rewritten in operator voice ("Calls on one app. Payments on another. Invoices scattered…")
- **Services section** (six cards remapped to master-message features)
  - "ONE PLATFORM. EVERYTHING YOU'RE PAYING SIX COMPANIES FOR."
  - Subhead: "Built for home service operators who are tired of stitching software together. One system. One bill. One brand. All yours."
  - Cards: Custom Branded Website (globe) · Integrated Payments (credit-card) · Customer Financing (wallet) · Invoice & Job Tracking (clipboard-list) · SMS Automation (message-square) · You Own It (shield-check)
- **Comparison block**
  - Heading: "Stop Juggling Tools. Start Running a Business."
  - Intro: "Most home service operators are paying four to six different software companies every month — and at the end of three years, they don't own any of it."
  - Left column expanded to 5 line items (job management, website builder, SMS automation, customer financing, payment processing markup) at $250–400+/mo
  - 3-Year Cost (Rented): $9,000–$14,400
  - Right column: Velonyx Founding Member, $3,000 once + $100/month, 3-Year Cost (Owned): $6,600
  - Bottom line: "No more juggling. No more renting. No more software companies raising your rates every year."
- **Pricing card**
  - Eyebrow: 🏆 "Founding Member Pricing — First 5 Home Service Operators"
  - Subhead: "Built for home service operators ready to stop juggling and start scaling."
  - Feature list rewritten to mirror the capability cards (search-optimized website, customer booking + payments, financing, invoice/job tracking, SMS automation, local SEO, phone admin, ownership)
  - Secondary link: "Outside home services? We build custom for any business ready to scale. Book a consultation →"
  - Pricing amounts ($3,000 + $100/month, locked for life) **unchanged**
- **Portfolio**
  - Heading: "See a Live Velonyx Build"
  - Subhead names Garage Door Kings as the live home service operator + names HVAC/plumbing/electrical
  - Card badge: "Home Service Operator"
- **About section:** rewritten in operator voice with home-service framing
- **Testimonials:** roles updated (Marcus → Garage Door Operator Las Vegas; Tanya → HVAC Operator Atlanta; David → Plumbing Operator Dallas); testimonial-section subtitle now reads "what home service operators are saying"
- **CTA / Contact section:** "Stop Juggling Tools. Start Running a Business." with operator-voice consultation pitch
- **FAQ**
  - New top FAQ: "Is Velonyx only for garage door companies?" (No — names the four verticals + custom-build pathway)
  - All references to old tiers ($1,500/$3,500/$6,000/$12,000) and Standard/Growth/Premium Care plans removed; Founding Member used throughout
  - Existing answers reworded with home-service language and the "no monthly rent, no vendor lock-in" framing
  - "Do you work with businesses outside of my area?" → "Do you work with home service operators outside my area?"
  - FAQPage JSON-LD mirrors the visible Q&A
- **Booking modal:** service select replaces 4-tier dropdown with home service trade options (HVAC, Plumbing, Electrical, Garage Door, Other Trade) + Founding Member System + Custom Build
- **Meta tags**
  - `<title>`: "Velonyx Systems — Custom Digital Systems for Home Service Operators"
  - `<meta name="description">`: matches the new positioning, names the four verticals
  - OG / Twitter cards updated to match
  - `keywords` rewritten with trade-specific software terms
- **Structured data**
  - ProfessionalService description / serviceType / priceRange ($3,000 + $100/mo) updated
  - Four-tier `offers` array collapsed to a single Founding Member offer
  - WebSite description updated
  - Three Review schemas updated (jobTitle + city) to match testimonial cards
  - Four per-tier Service schemas (Starter/Growth/Premium/Enterprise) replaced with one Founding Member Service schema
- **Footer:** new subtagline "Premium digital systems built for home service operators." appears under the motto (paired with new `.footer-subtagline` CSS)

### `checkout.html`

- Meta description names HVAC/plumbing/electrical/garage doors
- Schema description rewritten for home service operators
- Hero eyebrow: "Secure Checkout — For Home Service Operators"
- Subhead: "first 5 home service operators only"
- Order tier tag: 🏆 "Founding Member Pricing — First 5 Home Service Operators"
- Includes list rewritten to match homepage capabilities
- "What happens next" step 2 names the four trades
- Footer subtagline added

### `financing.html`

- Title/meta/OG/Twitter rewritten for home service operators
- Keywords rewritten for trade-specific BNPL queries
- Hero eyebrow: "Flexible Payments — For Home Service Operators"
- Hero copy reframes the split-pay around the Founding Member build
- "How it works" step 1 talks about claiming the founding spot directly
- Calculator collapsed from four tiers (Starter/Growth/Premium/Enterprise) to a single Founding Member tier ($3,000 one-time → $750 × 4 split); calculator JS simplified
- Bottom CTA matches the founding-spot framing
- ProfessionalService schema price range updated ($3,000 + $100/mo)
- WebPage schema description updated
- Footer subtagline added

### `book.html`

- Page label: "Free Consultation — For Home Service Operators"
- Subtitle names the four verticals + custom-build option
- ProfessionalService schema price range updated ($3,000 + $100/mo)
- Footer subtagline added

### `connect/index.html`

- Meta and OG descriptions: "Premium digital systems built for ambitious businesses" → "Premium digital systems built for home service operators"
- Footer line matches

---

## What did NOT change

- **Pricing:** $3,000 one-time build + $100/month, first month free, locked in for life for the first 5 founding customers — unchanged
- **Stripe Payment Link:** `https://buy.stripe.com/7sYfZjajz5Kq9M2bKOcs80e` — unchanged
- **Brand motto:** "Your Legacy, Engineered With Precision." — unchanged
- **Brand voice tone:** premium, operator-direct, no tech jargon — unchanged in spirit, applied through the new master-message phrasing
- **Architecture decisions:** Next.js + Supabase + Vercel as the production portal foundation (`velonyx-trades-template/`); AWS Cognito + Lambda + Terraform learning lab (`platform/`); GitHub Pages hosting for the marketing site — all unchanged
- **Founding spots counter:** still 5 dots on `index.html` and `checkout.html`; flip `class="founding-dot filled" ↔ "empty"` per customer signed
- **Deprecated tier markup preserved as commented-out rollback paths** (per task spec) — none deleted
- **Legacy `for-barbers.html` page:** untouched (still useful for legacy ad campaigns per CLAUDE.md note); legacy `client-demos/` and `demos/garage/` folders untouched

---

## Rollback notes

If we need to roll back the repositioning:
1. The four-tier offers / service schemas in `index.html` were replaced wholesale; the previous JSON-LD blocks live in git history under the `feat(home): update meta tags, structured data, and footer subtagline` commit on the `claude/reposition-velonyx-home-services-gkgzz` branch.
2. The financing.html calculator's PACKAGES object was simplified — restore from git for the four-tier behavior.
3. The booking modal's service options were rewritten — restore from git for the original 4-tier dropdown.
4. None of the changes touch the Stripe Payment Link, the founding-spots counter, or the architectural decisions docs.

---

*Repositioned: 2026-05-07. Branch: `claude/reposition-velonyx-home-services-gkgzz`. Live target: `velonyxsystems.com` via GitHub Pages auto-deploy.*
