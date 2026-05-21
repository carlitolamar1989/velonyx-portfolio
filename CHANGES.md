# Premium Conversion Overhaul — Changes

Branch: `feat/premium-conversion-overhaul`
Brief: top-to-bottom redesign + rewrite of `velonyxsystems.com` aimed at paid Meta acquisition. Brand voice anchored to `VELONYX-CONTEXT.md`; copy frameworks pulled from the installed skill packs (direct-response-copy, copywriting, ogilvy, cro). Banned-word sweep: zero verb-form violations across all public HTML at end of Phase 3.

---

## CRITICAL FIX 1 — Broken `0%/0d/0hr` counter (about section)

**Before:** Animated GSAP counter on `.val-number[data-target]` that rendered "0% / 0d / 0hr" until GSAP fired (and stayed at zero if GSAP failed). Hurt trust on every page load.

**After:** Three static stat tiles (no JS dependency):
- **100%** Custom-Engineered · No templates, ever
- **7–14d** Average Build Time · Industry norm: 4–6 weeks
- **Same-Day** Response Time · For Founding Members

New CSS rules `.val-sublabel`, `.val-number .val-unit`, `.val-text`. `data-target` attributes removed so the leftover counter JS is now a harmless no-op.

---

## CRITICAL FIX 2 — Top urgency banner

**New:** `/assets/urgency-banner.js` — auto-injects a thin fixed banner across `index.html`, `checkout.html`, `book.html`, `financing.html`:

> **Founding Member Pricing** — Only 5 spots at **$3,000 + $100/month**. After founding spots fill: $5,000 + $200/month.

Pattern mirrors `cookie-consent.js`. Fixed top, gold accent text on dark, dismissible X (per-page-load — reappears on next navigation as a real urgency cue per brief). Pushes the existing fixed nav down by `--vx-banner-h`. Connect/in-bio page intentionally excluded.

---

## CRITICAL FIX 3 — Hero rewrite (Option A: loss-aversion / pain-anchored)

**Before:** "The System Your Business / Has Been Waiting For." with "One platform. Built for you. Owned by you." sub.

**After:**
- **Eyebrow:** "For Home Service Operators Doing $100K–$2M"
- **H1 (white):** "Three Years." / "$9,000 in Software Bills."
- **H2 (gold):** "Nothing on Your Balance Sheet."
- **Sub-headline (gold):** "Velonyx fixes that. One custom platform. $3,000 build. $100/month. Yours forever."
- **Supporting paragraph:** "Velonyx engineers the custom platform that replaces your rented stack — website, payments, customer financing, SMS automation, and job tracking, consolidated into one system you own. Built for HVAC, plumbing, electrical, garage doors, and any service operator who'd rather pay once than pay forever."
- **Primary CTA:** "Book a 20-Minute Discovery Call" → `/book.html`
- **Secondary CTA:** "See a Live Build →" → `https://gdk.velonyxsystems.com/`
- **New trust strip:** "Stripe-Verified · Klarna / Affirm / Afterpay Built In · 7–14 Day Build · 5 Founding Spots Open"

Existing `splitTextToChars` char-reveal animation works unchanged.

---

## CRITICAL FIX 4 — Social proof above the fold

**Before:** Live-build (Garage Door Kings) portfolio section was between PRICING and ABOUT (~80% down the page).

**After:** Same GDK card, relocated to directly under the PROBLEM section. New heading "See a Real Velonyx Build — Live." Subhead matches brief: "Garage Door Kings — Las Vegas. A live operator running on the Velonyx platform right now. Full marketing site. Lead form. Customer portal. Admin dashboard with leads, jobs, SMS log, and reviews. Click through and explore the system that could be your business." Followup CTA now points to `/book.html` (was `#contact`).

---

## CRITICAL FIX 5 — Single primary CTA path

**Before:** "Book a Consultation" + "See Pricing" + "Claim a Founding Spot (Stripe)" + email + phone competing in the same viewport.

**After:** Every cold-traffic-visible CTA is `Book a 20-Minute Discovery Call` → `/book.html`. Stripe direct (`Claim a Founding Spot`) only appears AFTER the comparison block, inside the pricing card. Nav CTA shortened to "Book a 20-Min Call" for mobile fit.

---

## CRITICAL FIX 6 — Auto-open founding modal softened

**Before:** Auto-opens 2.6s after page load with a direct `$3,000 Stripe` checkout link as the primary CTA — violated the "cold traffic should not see a $3K checkout on first contact" rule from the brief.

**After:** Same scale-in entrance, same content. CTAs swapped:
- Primary: "Book a 20-Minute Discovery Call" → `/book.html`
- Secondary: "See the Live Build (Garage Door Kings) →" → `https://gdk.velonyxsystems.com/`
- Dismiss: "Maybe later — show me the site" (unchanged)

New `.founding-modal-secondary` CSS for the secondary link styling. Stripe direct still reachable through the normal pricing card lower on the page.

---

## CRITICAL FIX 7 — Two-step booking form

**Before:** Single 8-field form (First Name, Last Name, Phone, Email, Service, Description, SMS consent, Privacy consent). Conversion data says each field beyond 4 reduces submission rate 5–10%.

**After:**
- **Above the form:** "Prefer to text? Send **BUILD** to (877) 317-8643 — we'll reply within 60 minutes during business hours." (sms: link triggers native messages app)
- **Step 1** (3 fields visible immediately): First Name + Phone/Email toggle (default Phone) + Business Type dropdown (now grouped into "Home Services (our specialty)" + "Other Service Businesses" — expands to auto repair, cleaning services, dog grooming, fitness studios, photography studios, mobile services per brief). Continue button.
- **Step 2** (revealed after Continue): optional textarea + SMS consent + Privacy/Terms consent + Submit. Back button at top.

Phone/Email toggle swaps the `required` flag dynamically. Payload keeps `lastName: ''` for API back-compat. On modal close, form resets to step 1.

---

## SECTION OVERHAUL 1 — Comparison block

**Before:** Two-column comparison labeled "Your Current Stack" (banned-word "Patched-Together Tools") vs. "Velonyx Founding Member."

**After:**
- **Left panel "The Rented Stack":** 5 line items totaling $250–400/month, $9,000–$14,400 3-year cost, "What you own at the end: **$0.**"
- **Right panel "The Velonyx Platform":** one custom-engineered platform replacing the rented stack, $3,000 build + $100/month broken out, $6,600 3-year cost, "What you own at the end: **The entire platform.** On your balance sheet. Not someone else's."
- **New takeaway line below both panels:** "27%–54% cheaper over three years. **And you own it forever.**" (real arithmetic — brief said 30–55%, actual math is $6,600 / $9k–$14.4k = 27%–54%)
- New `.comparison-takeaway` CSS

---

## SECTION OVERHAUL 2 — "What We Engineer" feature blocks

All 6 cards rewritten with outcome-first copy per the brief. Headline of each card and tag:

| Card | New copy summary |
|------|------------------|
| Custom-Engineered Website | "built to rank locally and compound search authority month over month" |
| Integrated Payments | "No friction at the close" |
| Customer Financing | "Higher average ticket. Lower customer drop-off." |
| Job & Invoice Tracking | "Your business runs from a single screen" |
| SMS Automation | "Sub-60-second lead response... Speed-to-lead is the single biggest predictor of closing rate" (new tag: "Sub-60-Second Response") |
| You Own It | "all on your balance sheet" (new tag: "On Your Balance Sheet") |

Section subhead dropped the banned-word "Stop stitching software together" → simplified to "One system. One bill. One brand. All yours."

---

## SECTION OVERHAUL 3 — Process section with Day-X timeframes

New `.process-when` CSS for the day labels.

| Step | When | Title |
|------|------|-------|
| 1 | Day 1 | Free Consultation (20-minute) |
| 2 | Day 1–2 | Secure Your Project (50% deposit) |
| 3 | Days 3–10 | Design & Build (live preview link) |
| 4 | Days 10–13 | Refine (capped revision window) |
| 5 | Day 14 | Launch (deploy + connect payments) |

---

## SECTION OVERHAUL 4 — About → Founder note

**Before:** Feature-heavy "Engineered Legacies, Not Rented Software" with paragraphs about what we build.

**After:** Signed founder note titled "Why Velonyx Exists." Per the brief verbatim:
> I built Velonyx Systems because too many ambitious operators have been sold the same lie: that renting software is the modern way to run a business... Velonyx is the answer for operators who think long-term...
>
> — Carlos, Founder

New `.founder-signature` block: Velonyx shield (placeholder until a headshot is provided) + name + title. Section label "From the Founder."

---

## SECTION OVERHAUL 5 — FAQ rewrites

Three answers rewritten verbatim from the brief; matching FAQPage JSON-LD entries updated to stay in sync:

1. **"What if I don't like the design?"** — added closing line: "Most builds reach final approval within two rounds."
2. **"Do I own the system after it's built?"** — rewritten with "you build a business asset, not a monthly bill" framing.
3. **"Why should I choose Velonyx over SaaS tools..."** — 3-paragraph answer ending "do you want to rent forever, or own?"

---

## SECTION OVERHAUL 6 — Final CTA section

**Before:** "Stop Juggling Tools. Start Running a Business." (banned-word).

**After:** "Build Once. Own It Forever." with the brief's "if you've made it this far, you've already done the math" body. Primary CTA: "Book a 20-Minute Discovery Call." Secondary text link: "Already done the math? See the Founding Spot offer →"

---

## Structured-data + meta sync (Phase 3)

| Element | Updated |
|---------|---------|
| `<title>` | "Velonyx Systems — Custom Platforms That Replace Your Rented Stack" |
| `<meta name="description">` | Math-anchored description ($9,000 / 3 years / $0) + offer ($3K + $100/mo) |
| `og:title`, `og:description`, `twitter:title`, `twitter:description` | Match new title/description |
| Keywords | Pivot to "custom digital platform / replace SaaS stack / owned infrastructure" |
| ProfessionalService JSON-LD description | New positioning |
| WebSite JSON-LD description | New positioning |
| Service JSON-LD description (Founding Member) | Includes founding-spot scarcity + post-founding price |
| FAQPage JSON-LD entries | 2 entries rewritten to match new visible copy |

---

## CLAUDE.md update

Canonical hero copy block + sharper hooks list refreshed with the new headline and CTAs. Brand voice rules unchanged.

---

## Files touched

| File | Change |
|------|--------|
| `index.html` | All section overhauls + meta + JSON-LD + inline CSS additions |
| `checkout.html`, `book.html`, `financing.html` | Urgency banner script include |
| `assets/urgency-banner.js` | **New** — auto-injecting banner module |
| `CLAUDE.md` | Canonical hero copy block refresh |
| `CHANGES.md` | **New** (this file) |
| `CONVERSION-NOTES.md` | **New** — framework rationale per change |

---

## Round 2 Updates — May 19, 2026

Branch: `feat/round-2-founder-payments-refund`
Scope: founder reveal, payments scrub (Affirm → Klarna + Afterpay + ACH), OG social card, GDK demo labeling, FAQ + refund policy, JSON-LD address correction (San Diego → Chula Vista 91914), refund policy page.

### 1 · OG Social Card

Generated `assets/og-social-card.jpg` (1200×630 JPG, 84 KB) via Pillow 12.2.0. Near-black bg (#08080A), shield left, white H1 + gold H2 right, off-white subhead, gold wordmark bottom-right. Wired into `og:image` + `twitter:image` meta tags across `index.html`, `book.html`, `checkout.html`, `financing.html`, `connect/index.html`, and the new `refund-policy.html`.

### 2 · Affirm scrub

Removed every Affirm reference site-wide. Active payment methods now: **Cards, Apple Pay, Google Pay, Klarna, Afterpay, ACH Direct Debit.** 25+ instances across `index.html`, `checkout.html`, `financing.html`, `sow.html`, `msa.html`, `terms.html`, `for-barbers.html`. `financing.html` calculator collapsed from 3 provider columns to 2 (Klarna + Afterpay); orphaned `.affirm` CSS rules + `--affirm-*` variables removed. Trust strip rewritten: "Powered by Stripe · Apple Pay & Google Pay · Klarna & Afterpay · ACH Direct Debit · 5 Founding Spots Open". Final audit: **0 visible Affirm refs.**

### 3 · Founder reveal

`index.html` `.about` section body swapped to user's verbatim 3-paragraph bio: founder background combining technical engineering with operational discipline; the "why" — owners running across too many disconnected apps; based in San Diego, building nationally. Signature changed to "— Carlos, Founder" (no personal LinkedIn link per user instruction). Shield watermark + `.founder-mark` unchanged.

### 4 · GDK demo relabeling

`Live Client Build` → `Live Demo Build`. Title: "See a Real Velonyx Build — Live Demo." Card badge: "Demo Build · Home Service" (was "Home Service Operator"). Subhead clarifies GDK is engineered to demonstrate what a Velonyx system looks and feels like (not a paying client). Portfolio CTA + hero secondary CTA both now read "Explore the Live Demo →" pointing at `https://gdk.velonyxsystems.com/`.

### 5 · FAQ revisions

- "What if I don't like the design?" rewritten: "up to 2 rounds of revisions within a 5 business day revision window after preview delivery. After the revision window closes, additional changes are billed at $100/hour."
- New entry: "What's your refund policy?" — summarizes the tiered-by-phase policy and links to `/refund-policy.html`.
- FAQPage JSON-LD synced: design-revision answer, ACH Direct Debit added to included-system list, new refund-policy Q&A inserted.

### 6 · JSON-LD address + sameAs

ProfessionalService address: `addressLocality` San Diego → Chula Vista, added `postalCode: 91914`. `geo.placename` + `geo.position` + ICBM coordinates updated to Chula Vista (32.6401, -116.9722). `sameAs` expanded to 3 entries: Instagram, LinkedIn company, Google share link (`https://share.google/JcxNJcFrrxxC0OAeo`). Footer line: "San Diego, CA" → "Chula Vista, CA · Serving home service operators nationwide". (Founder bio paragraph 3 retains "Based in San Diego" — verbatim from user; Chula Vista is in San Diego County so no contradiction.)

### 7 · Refund Policy

New `/refund-policy.html` page mirroring the styling of `terms.html` / `privacy.html`. 4-phase tiered policy (Option E):
- **Phase 1** (≤24h, pre-kickoff): full refund less processing fees
- **Phase 2** (post-kickoff, pre-preview): partial refund less work completed
- **Phase 3** (post-preview, pre-launch): refund limited to unstarted scoped work
- **Phase 4** (post-launch): non-refundable — delivered build

Care plan cancellation, chargeback policy, and refund-request process included. Added to `sitemap.xml`. Footer legal-links row updated across `index.html`, `checkout.html`, `book.html`, `financing.html`, `terms.html`, `privacy.html`, `msa.html`, `sow.html`, `sms-terms.html`, `sms-opt-in.html`.

### Files touched (Round 2)

| File | Change |
|------|--------|
| `assets/og-social-card.jpg` | **New** — 1200×630 OG card |
| `refund-policy.html` | **New** — tiered refund policy page |
| `index.html` | Affirm scrub, founder bio, GDK relabel, FAQ + FAQ JSON-LD, address JSON-LD, footer address + refund link, OG meta |
| `checkout.html` | Affirm scrub, OG meta, footer refund link |
| `book.html` | OG meta, footer refund link |
| `financing.html` | Affirm scrub (calculator + provider cards + CSS), OG meta, footer refund link |
| `connect/index.html` | OG meta |
| `terms.html`, `privacy.html`, `msa.html`, `sow.html` | Affirm scrub (where present), footer refund link |
| `sms-terms.html`, `sms-opt-in.html` | Footer refund link |
| `for-barbers.html` | Affirm scrub |
| `sitemap.xml` | +1 url entry for `/refund-policy.html` |
| `CHANGES.md` | This section |
| `CONVERSION-NOTES.md` | Round 2 rationale per item |


---

## Pricing & Structure Revamp — May 21, 2026

Branch: `claude/reposition-velonyx-home-services-gkgzz` (extends PR #16)
Scope: full pricing rebuild from the $3,000/$100 founding-member single-tier to the new multi-tier structure built around the $700 core offer + premium-at-budget positioning.

### Inventory — every old-pricing location replaced

| File | Old refs | Now reads |
|---|---|---|
| `index.html` head meta + title | $3,000 build + $100/month, "System That Scales the Business You've Built" | $700 build + $70/month, "The Premium Platform Without the Premium Price" |
| `index.html` ProfessionalService JSON-LD | priceRange "$3,000 + $100/mo", single Founding Member offer | priceRange "$700 + $70/mo", 7 offers (core build + Care + Growth + Accelerate + Full Partner + Video + Video+Ads) |
| `index.html` WebSite + WebPage + Service JSON-LD | Founding Member System, $3,000/$100 | The Velonyx System / Velonyx Custom Platform, $700/$70 |
| `index.html` FAQPage JSON-LD | 9 entries anchored on founding pricing | 12 entries: Why So Affordable, $700 inclusions, $70 Care coverage, Growth plans, Standalones, plus the existing ownership/timeline/payment/refund entries |
| `index.html` hero | "You've Built the Business. / Now Build the System That Runs It." + $3,000/$100 trust strip | "The Premium Platform / Without the Premium Price." + agency-vs-Velonyx math + Custom-Engineered/You Own Everything trust strip |
| `index.html` Services section heading | "What We Engineer" / "One Platform. Everything Your Business Needs to Run." | "What's Included" / "Everything in the $700 Build." + new 24/7 Booking card |
| `index.html` Process step 2 | "reserves your founding spot" | "reserves your build slot" |
| `index.html` Pricing section | $3,000 founding card + 5 founding spots counter + $5,000/$200 fallback | Premium Platform / Budget Price hero + $700 core build card + Why So Affordable 4-item block + 4-tier Growth Plans grid + 2-card Standalone Subs grid |
| `index.html` Comparison block | 2 columns (Rented Stack $9k-14.4k vs Velonyx $6,600) | 3 columns: Agency $10,400-25,800 / Rented $5,760-10,440 / Velonyx $3,220 — premium-at-budget takeaway |
| `index.html` FAQ visible entries | 10 entries with founding/$3,000/$100 language | 15 entries mirroring the new FAQPage JSON-LD |
| `index.html` About-values tile | "For Founding Members" | "On the Care plan" |
| `index.html` Final CTA | $10,000+ vs $3,000/$100 math + "5 founding spots open" + "$5,000 + $200 after" + secondary link "See the Founding Spot offer" | Agency vs Rented vs Velonyx 3-year math + "Want to see it first? Explore the live demo" |
| `index.html` offer reveal modal (repurposed founding modal) | "Founding Member · First 5 Customers Only" + $3,000/$100 + 8 founding inclusions + "Locked in for Life" | "The Premium Platform · Without the Premium Price" + $700/$70 + 8 core inclusions including 24/7 booking + ACH + "Yours Forever" |
| `checkout.html` head + JSON-LD | Founding Member System, $3,000/$100, LimitedAvailability | The Velonyx System, $700/$70, InStock |
| `checkout.html` hero + body | "Claim Your Founding Spot" + 5-dot spots counter + $3,000 order card + Stripe pay button | "Claim Your Velonyx Platform" + $700 order card + Book a Call CTA (Stripe link being prepared per TODO) |
| `checkout.html` next-steps + FAQ | $3,000/$100 founding language across all 4 steps + 4 FAQ entries | $700/$70 build flow + 5 FAQ entries: own/why-cheap/cancel/care-coverage/custom-scope |
| `financing.html` ProfessionalService JSON-LD | priceRange $3,000 + $100/mo | priceRange $700 + $70/mo |
| `financing.html` calculator + provider cards | base $3,000 → $750 × 4, "Claim Your Founding Spot" CTA | base $700 → $175 × 4, "Book a Call & Pay Your Way" CTA |
| `financing.html` "How It Works" step 1 | "Claim Your Founding Spot" | "Start at Checkout" |
| `book.html` JSON-LD priceRange | $3,000 + $100/mo | $700 + $70/mo |
| `refund-policy.html` Care plan paragraph | $100/month Care plan | $70/month Care plan, references $700 build fee |
| `assets/urgency-banner.js` | "Founding Member Pricing — Only 5 spots at $3,000 + $100/month. After founding spots fill: $5,000 + $200/month." | "Premium Platform, Budget Price — The Velonyx System: $700 build + $70/month. Yours forever." |
| `assets/og-social-card.jpg` | "You've Built the Business / Now Build the System That Runs It." | "The Premium Platform / Without the Premium Price." + agency-vs-Velonyx math |

### Brand-new sections

- **Why So Affordable?** (4-item objection-killer block): Modern Tools / Refined Process / No Agency Overhead / Built to Earn Long-Term
- **Grow Your Business** (4-tier growth plans grid): Care $70 / Growth $250 / Accelerate $500 + ad spend / Full Partner $1,500 + ad spend
- **Just Need One Thing?** (2-card standalones grid): Video $200 / Video + Ad Setup & Monitoring $350 + ad spend
- **3-column comparison**: Agency / Rented Software / Velonyx — 3-year math anchored
- **24/7 Online Booking** service card added to the What's Included grid

### "+ ad spend" rule

Surfaced as a gold-bordered pill badge on Accelerate, Full Partner, and the Video+Ads standalone card. Reinforced in plain text inside each feature list: "You fund ad spend directly to the ad platform." FAQ entry on growth plans reiterates the rule.

### Stripe Payment Link

Old $3,000 Founding Member link is retained ONLY on `/checkout.html` with a `TODO` comment block. The primary CTAs across the site route to `/book.html` (Discovery Call). New Stripe Payment Link for $700 + $70/mo is awaiting creation in the Stripe dashboard; once the URL is provided, swap the placeholder in `checkout.html` and the founding-grid CTA on `index.html`.

### Founding modal repurposed (not removed)

Per user direction ("this is going to be the new founding module"), the auto-opening modal at session start now surfaces the $700/$70 core offer with the premium-at-budget framing — same component, same trigger, same dismiss-once-per-session behavior, but rewritten copy + new pricing + ACH added to the inclusions list.

### Files touched (Pricing Revamp)

| File | Change |
|------|--------|
| `index.html` | Hero, meta, JSON-LD (Org + WebSite + WebPage + Service + FAQPage), Services heading + new booking card, Process founding-spot fix, full pricing section overhaul (Why So Affordable + Growth Plans + Standalones), 3-column comparison, FAQ visible entries, About-values tile, Final CTA, offer reveal modal |
| `checkout.html` | Title, meta, OG/Twitter, Service JSON-LD, hero, spots-counter removal, full order card, next-steps, FAQ, trust bar |
| `financing.html` | JSON-LD priceRange + description, hero copy, calculator base + math, provider step 1, fineprint, final CTA |
| `book.html` | JSON-LD priceRange |
| `refund-policy.html` | Care plan paragraph |
| `assets/urgency-banner.js` | Banner copy |
| `assets/og-social-card.jpg` | Regenerated with new headline |
| `CHANGES.md` | This section |
| `CONVERSION-NOTES.md` | Pricing-revamp rationale |

