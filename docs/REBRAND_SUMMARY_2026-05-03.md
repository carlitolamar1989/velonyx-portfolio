# Velonyx Systems Rebrand — Completion Summary

**Date:** 2026-05-03
**Execution mode:** Fully autonomous (no approvals, no pauses)
**Trigger:** Carlos's positioning shift task — repositioning Velonyx from "we build premium websites" to "we engineer custom business systems for service operators"
**Operator:** Claude (Sonnet 4.5)
**Live URL:** https://velonyxsystems.com/

---

## What changed

### Sections of `index.html` rewritten or added

1. **Hero section** — H1, H2, eyebrow, sub-paragraph, CTA labels rewritten
2. **Services section** — H2, subhead, and all 6 service cards reframed as integrated capabilities
3. **NEW: "Why Velonyx vs SaaS Tools" section** — added between Process and Pricing with 3-card comparison grid + summary block + CTA
4. **About section** — H2 + 3 paragraphs rewritten
5. **FAQ section** — 5 of 8 visible questions updated (the ones centering "website")
6. **`<head>` meta tags** — title, description, OG, Twitter, keywords
7. **JSON-LD schema (11 blocks)** — Organization, WebSite, Service ×4, FAQPage rewritten; AggregateRating + 3 Reviews + ICBM/geo unchanged

### Files outside `index.html`

- **`humans.txt`** — full rewrite around new positioning
- **NEW: `docs/REBRAND_DEPLOY_VERIFICATION.md`** — live-site verification doc
- **NEW: `docs/REBRAND_SUMMARY_2026-05-03.md`** — this doc
- **NEW: `docs/VELONYX_SITE_DIAGNOSTIC.md`** — pre-rebrand audit (committed for future reference)

### Files explicitly NOT touched (intentional, per task scope)

- `404.html` — has only the brand tagline footer; no positioning copy to change
- `book.html`, `checkout.html`, `financing.html`, `for-barbers.html`
- `privacy.html`, `terms.html`, `msa.html`, `sow.html`, `sms-terms.html`, `sms-opt-in.html`
- All design tokens (colors, fonts, layout) — palette / typography / hero video preserved
- All pricing tiers and Stripe Payment Links — exactly as-is
- All testimonials
- The portfolio cards (already aligned)
- `/demos/` (entire Garage Door Kings demo folder)
- `/platform/` (unapplied AWS Cognito stack)
- `/velonyx-trades-template/` (separate Vercel project)
- `/velonyx-website/` (stale mirror folder)

---

## Before / After — hero section

### Before
> **H1:** "Stop Selling in the DMs."
> **H2:** "Start Selling with a Premium Website."
> **Eyebrow:** "Premium Digital Systems"
> **Sub:** "We build luxury websites with built-in payment systems for businesses, product sellers, and service providers. Your customers land, trust, and pay — all in one place."
> **CTAs:** "Book a Consultation" / "View Services"

### After
> **H1:** "Stop Renting Your Business Tools."
> **H2:** "Start Owning Your Infrastructure."
> **Eyebrow:** "Custom Business Systems for Service Operators"
> **Sub:** "Velonyx engineers custom business systems for service operators — one integrated platform that replaces the patchwork of tools running your business. Booking, payments, customer management, invoicing, SMS automation, and a premium branded website. All connected. All branded as you. All owned by you. Your legacy, engineered with precision."
> **CTAs:** "Book Free Consultation" / "See Pricing"

The slogan ("Your Legacy, Engineered With Precision.") was preserved in its exact existing position.

---

## Before / After — services section header

### Before
> **Section label:** "What We Build"
> **H2:** "Everything Your Business Needs Online"
> **Subhead:** "From concept to launch. One partner. No headaches."

### After
> **Section label:** "What We Engineer"
> **H2:** "One System. Six Integrated Capabilities."
> **Subhead:** "Velonyx isn't a website company. We engineer the complete operating system that runs your service business."

The 6 service cards were renamed and rewritten:

| Old card | New card |
|---|---|
| Premium Website Design | Custom Branded Platform |
| Payment Integration | Integrated Payment System |
| Buy Now, Pay Later | Customer Financing (BNPL) |
| Hosting & Deployment | Production Hosting & Deployment |
| Ongoing Maintenance | Ongoing Care & Maintenance |
| Digital Consulting | Digital Operations Consulting |

---

## NEW: "Why Velonyx" section (between Process and Pricing)

- **Section label:** "Rent vs Own"
- **H2:** "Why Velonyx Beats Renting Your Tools"
- **Subhead:** "Most service businesses pay $200–$500/month renting fragmented tools. Here's the math on owning your infrastructure instead."
- **Comparison grid (3 cards):**
  - Patched-Together SaaS (Year 1: ~$3,600–$6,000 / Year 3: ~$10,800–$18,000 / Owns: Nothing)
  - Custom Software Agency (Year 1: $50,000–$150,000 / Year 3: $80,000–$200,000 / Owns: Full)
  - **Velonyx Foundation Tier** (Year 1: $3,000 / Year 3: $6,000 / Owns: Full) — featured/gold-accented
- **Summary block:** Plain-English close on lock-in, price hikes, full ownership.
- **CTA:** "See How Much You'd Save →" linking to `#pricing`.

Includes new responsive CSS that collapses to a single column under 900px.

---

## Live URL with new positioning

- **Apex:** https://velonyxsystems.com/ — HTTP 200 ✓
- **www:** https://www.velonyxsystems.com/ — HTTP 301 → apex (expected) ✓
- **GitHub Pages deploy:** Action run `25291988336`, completed in 19s, deployed at ~21:59:50 UTC on 2026-05-03

Verified live elements:
- New `<title>` in `<head>` ✓
- New hero H1 "Stop Renting Your Business Tools." in body ✓
- New hero H2 "Start Owning Your Infrastructure." in body ✓
- New services section H2 "One System. Six Integrated Capabilities." ✓
- New "Why Velonyx" section live with 3-card comparison ✓
- New About H2 "Engineered Legacies, Not Rented Software." ✓
- 5 FAQ questions reworded to "system" framing ✓
- 11/11 JSON-LD blocks valid ✓
- humans.txt rewritten ✓

Full verification log: `docs/REBRAND_DEPLOY_VERIFICATION.md`.

---

## Confirmation: meta tags reflect new positioning

| Tag | Value |
|---|---|
| `<title>` | `Velonyx Systems \| Custom Business Systems for Service Operators` |
| `meta name="description"` | "Velonyx engineers custom business systems for service operators. Integrated platform: payments, customer management, SMS, SEO, branded website. Owned by you, not rented. Your Legacy, Engineered With Precision." |
| `og:title` / `twitter:title` | match `<title>` |
| `og:description` / `twitter:description` | match `<meta description>` |
| `og:image` / `twitter:image` | now use local logo asset (`assets/vs-logo-shield-clean.png`) instead of generic Unsplash placeholder |
| `keywords` | expanded with vertical-specific terms (HVAC, plumbing, garage door, electrician, landscaping, etc.) |

---

## Decisions made autonomously

These were judgment calls made during execution. Carlos can ask for any of them to be reverted or adjusted.

1. **"Why Velonyx" section placement.** Task said "after services and before pricing." I placed it between **Process** and **Pricing** (services → process → why → pricing) instead of immediately after services. Reasoning: the comparison is fundamentally about cost / ownership, which reads stronger right before the pricing tiers. Both placements satisfy the task constraint.

2. **About section H2 rewrite.** "About" was listed in the SCOPE-TO-TOUCH section but didn't appear as a numbered priority. I bundled it into the Priority 5 commit. The H2 changed from "Built for Presence. Engineered for Growth." to "**Engineered Legacies, Not Rented Software.**" — uses one of the supporting positioning sentences from the spec verbatim. Body text rewritten to drop "DMs and phone calls" framing and add field-service vertical examples (garage door, HVAC, plumbing, electrical, landscaping).

3. **FAQ Q6 ("Why Velonyx over Wix/Squarespace?") expanded to also call out Housecall Pro, ServiceTitan, and Jobber.** This aligns better with the new ICP (service operators) and the rent-vs-own thesis.

4. **og:image switched to local logo asset.** The previous og:image was a generic Unsplash photo (`photo-1550751827-4bd374c3f58b`). Replaced with `assets/vs-logo-shield-clean.png` for brand consistency and to remove the external dependency.

5. **404.html left untouched.** Inspected — only had brand tagline in footer, no positioning copy.

6. **Closing CTA section ("Ready to Stop Losing Customers in the DMs?") left untouched.** Not in the explicit scope; preserved for a follow-up pass.

7. **Problem section ("DM me for pricing... that's not a business.") left untouched.** Not in scope; the hook still works conceptually as "stop doing things the hard way" which is adjacent to the rent-vs-own thesis. Carlos may want a follow-up pass.

8. **Diagnostic audit doc committed.** The pre-rebrand `docs/VELONYX_SITE_DIAGNOSTIC.md` was previously generated but uncommitted. Added to the same push so it's preserved in the repo for reference.

9. **`platform/`, `velonyx-trades-template/`, `velonyx-website/`, `external/` left untracked.** No cleanup attempted in this session — explicitly out of scope.

10. **Hero CSS / responsive breakpoints not changed.** The existing CSS for `.hero-h1-top` and `.hero-h2-bottom` already handles the new copy length without overflow on mobile (`@media (max-width: 900px)` rules cap them at 2rem / 1.6rem).

---

## Pages NOT touched in this rebrand (still need a follow-up pass)

These contain copy that may now feel inconsistent with the new positioning. Carlos may want a Phase-2 rebrand pass on each:

- **`book.html`** — Calendly embed page. Likely contains "book a consultation about your website" copy.
- **`checkout.html`** — Plan cards still labeled "Starter Website Package", "Growth Website Package", etc. Stripe Payment Links untouched per scope, but the visible copy needs aligning. **Highest follow-up priority.**
- **`financing.html`** — BNPL explainer. Refers to "websites" as the product.
- **`for-barbers.html`** — Vertical landing page built Apr 23. Likely says "premium website" throughout.
- **`privacy.html`, `terms.html`, `msa.html`, `sow.html`, `sms-terms.html`, `sms-opt-in.html`** — Legal pages. Most language is generic and probably fine, but a quick sweep for "website" → "system" wording would tighten consistency.
- **Closing CTA on `index.html`** ("Ready to Stop Losing Customers in the DMs?") — out of scope this round, but worth aligning to "Ready to Stop Renting Your Business Tools?" or similar.
- **`index.html` Problem section** ("DM me for pricing...") — works conceptually but uses old hook.
- **`/demos/garage/` (Garage Door Kings demo)** — explicitly out of scope; demo's own copy stands on its own.

---

## Recommendations for next session

### Highest leverage (do first)

1. **Sweep `checkout.html`** to rename "Website Package" → "System" and update plan-card descriptions. The price-card copy is what visitors see right before they convert; mismatch with the rebrand will hurt conversion.

2. **Sweep `book.html`** Calendly intake copy — make sure the consultation framing matches the new positioning ("custom business system" vs "premium website").

3. **Sweep `for-barbers.html`** — vertical landing pages need to lead with the "system replaces your patchwork of tools" framing now, not "premium website." If the ad creative running to this page still says "website builder," update both the ad and the page together.

4. **Add a single new vertical landing page: `/for-garage-door.html` (or `/for-hvac.html`)** that mirrors the `/for-barbers.html` pattern but uses the field-service ICP (garage door, HVAC, plumbing, etc.) and links the new GDK demo at `gdk.velonyxsystems.com` as proof. The ICP for the rebrand is field-service operators — there should be a vertical landing page for them.

### Medium leverage

5. **Update closing CTA on `index.html`.** "Ready to Stop Losing Customers in the DMs?" → "Ready to Own Your Infrastructure?" or similar. One-line edit.

6. **Update Problem section on `index.html`.** Could keep the "DM me for pricing" hook but pivot the conclusion to "you don't need a website — you need a business system."

7. **Regenerate the NotebookLM "Hear The Pitch" audio.** The current 21-min audio overview was sourced from the pre-rebrand site copy. After the next consolidated copy pass, regenerate it from the new positioning. This is non-trivial (NotebookLM run + manual review of new audio) but pays off because the audio is featured on the homepage.

### Architectural cleanup (still on the docket from the diagnostic)

8. **Decision on `platform/` vs `velonyx-trades-template/`.** Per the diagnostic, these are two parallel portal systems that have never been reconciled. Picking one (recommended: extend `velonyx-trades-template/` into the official PWA portal foundation) would unblock the next major build cycle.

9. **Delete the stale `velonyx-website/` mirror folder.** 649 MB, duplicate HTML, contains orphan assets. Highest deletion candidate from the diagnostic. Safe to remove — `.gitignore` already excludes its `backend/` subdir, but the duplicate static HTML serves no purpose.

10. **Move `velonyx-trades-template/` and `external/` out of this repo into separate clones.** They're embedded as separate git histories, which causes dual-deployment confusion.

### Nice to have

11. **Add `assets/brand-config.js`** as a single source of truth for brand strings (palette, logo path, audio path, brand name, phone, slogan). Then a future rebrand becomes a 10-line edit, not a 50-file find/replace. The current rebrand was painless because the scope was narrow — but the next one (when Velonyx adds a sub-brand or rebrands a vertical product) will be ugly without this.

12. **Add link-checking GitHub Action.** Catches dead Stripe / Calendly / external links before they break in production. No-cost, runs on PR.

---

## Commit log for this session

```
8ec2df1 Add site + portal diagnostic audit doc
397304f Rebrand: FAQ copy + About section updated to reference system over website
6a6689f Rebrand: meta tags and schema markup updated for new positioning
e97cdd9 Rebrand: added 'Velonyx vs SaaS' comparison section addressing rent-vs-own positioning
0daaaad Rebrand: services section reframed as 6 integrated capabilities of one system
5adaffc Rebrand: hero section repositioned to 'rent vs own' framing
```

All 6 commits pushed to `origin/main`. Single GitHub Actions run (`25291988336`) deployed all changes in 19s.

---

## End of summary

Site is live at https://velonyxsystems.com/ with new positioning. Carlos can review the live site directly and request follow-up passes on any of the items in the "Recommendations for next session" list. No pending work blocking; rebrand goal met.
