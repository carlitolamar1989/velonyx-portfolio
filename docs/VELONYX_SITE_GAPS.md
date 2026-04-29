# Velonyx Systems Site — Funnel Page Gaps Audit

**Audit date:** April 29, 2026
**Auditor:** Claude (autonomous run, Priority 4 of demo consolidation)
**Scope:** Verify what funnel pages exist on velonyxsystems.com so the new demo CTAs link to working URLs (with documented fallbacks).

---

## TL;DR

Of the 7 funnel-page paths the new demo CTAs might want to point to, **only 4 exist as standalone pages** on velonyxsystems.com. The other 3 either don't exist, or live as anchors inside the homepage.

The Priority 3 demo CTAs were configured with this gap in mind:

| CTA on demo | Wanted to link to | Actual link used | Reason |
|---|---|---|---|
| Demo banner "See What We'd Build For You" | `/services` or `/trades` | `https://velonyxsystems.com/` (homepage) | Neither exists. Homepage hero is brand-strong enough to serve as fallback. |
| Footer "Book a Free Consultation" | `/book` or `/contact` | `https://velonyxsystems.com/book.html` | `/book.html` exists (Calendly embed) — direct hit. |
| Footer "View Pricing" | `/pricing` | `https://velonyxsystems.com/checkout.html` | `/pricing` doesn't exist; `/checkout.html` displays the 4-tier pricing grid. |
| Floating "Book Consultation" | `/book` | `https://velonyxsystems.com/book.html` | Same as footer — direct hit. |
| Contextual CTAs on admin/portal/pay | `/book` or `/` | `https://velonyxsystems.com/book.html` and `/` | Mix of book.html and homepage depending on context. |

**No demo CTA points to a 404.** All fallbacks are reasonable.

---

## Method

Two checks per candidate URL, run on April 29, 2026:

```bash
curl -sI -o /dev/null -w "%{http_code}" "https://velonyxsystems.com/${page}.html"
curl -sI -o /dev/null -w "%{http_code}" "https://velonyxsystems.com/${page}"
```

Plus a grep of `index.html` for anchor IDs that the homepage might serve as (e.g., `id="pricing"` makes `/#pricing` a viable target).

---

## Page-by-page audit

### ✅ `/book` and `/book.html` — EXISTS (200)
- Standalone Calendly-embed page.
- All "Book a Free Consultation" demo CTAs route here.
- **No gap.**

### ✅ `/checkout.html` — EXISTS (200)
- Full 4-tier pricing grid (Starter / Growth / Premium / Enterprise) with deposit/BNPL options.
- Used as fallback for "View Pricing" demo CTA.
- **Acceptable substitute for `/pricing`** but worth considering renaming or aliasing in the future.

### ✅ `/financing.html` — EXISTS (200)
- BNPL explainer (Klarna/Affirm/Afterpay).
- Not currently linked from any demo CTA, but lives as a deep link from checkout.

### ✅ `/for-barbers.html` — EXISTS (200)
- Vertical-specific landing page, similar shape to a `/trades` page would be.
- Pattern is replicable: future `/for-trades.html`, `/for-medspas.html`, etc.

### ❌ `/services` and `/services.html` — DO NOT EXIST (404)
- Homepage has `#services` anchor (`<section ... id="services">`).
- A standalone `/services.html` page would carry SEO and conversion benefit but does not exist.
- **Demo banner CTA falls back to `https://velonyxsystems.com/`** — the homepage hero/services section is visible after one scroll.

### ❌ `/trades` and `/trades.html` — DO NOT EXIST (404)
- Would be ideal for trades-vertical CTAs (HVAC, plumbing, electrical, garage door).
- Pattern would mirror `/for-barbers.html`.
- Possible name: `/for-trades.html` or `/trades.html`.

### ❌ `/contact` and `/contact.html` — DO NOT EXIST (404)
- Functionally replaced by `/book.html` (Calendly).
- No standalone contact form on the site.

### ❌ `/pricing` and `/pricing.html` — DO NOT EXIST (404)
- `/checkout.html` serves this role today.
- A dedicated `/pricing.html` aligned with industry-standard URL structure would help SEO + paid-ads landing-page hygiene.

### ❌ `/portfolio` and `/work` — DO NOT EXIST (404)
- Homepage has `#work` anchor with the 4 portfolio thumbnails (Throne, IronWill, Lens & Light, Apex SMP).
- Future `/portfolio.html` could host the GDK demo as a 5th case study.

### ❌ `/about` — DOES NOT EXIST (404)
- Homepage has `#about` anchor.
- Founder-bio + brand-voice content lives there inline.

---

## Pages that DO exist on velonyxsystems.com (full inventory)

```
/                       (index.html)               ← homepage
/404.html
/book.html              ← Calendly booking
/checkout.html          ← 4-tier pricing grid
/financing.html         ← BNPL explainer
/for-barbers.html       ← vertical landing page (barbershop)
/msa.html               ← Master Service Agreement
/privacy.html           ← privacy policy
/sms-opt-in.html
/sms-terms.html
/sow.html               ← Statement of Work
/terms.html             ← terms of service
```

Plus `/demos/garage/*` (the 11 demo pages), `/demos/smp/` (SMP demo), legal pack, and assets.

---

## Recommended future pages (not built in this run, but worth queueing)

These would close the gaps without changing the demo CTAs:

1. **`/services.html`** — service grid + tier description, replacing `#services` anchor as the canonical destination. Demo banner CTA could be repointed once live.
2. **`/pricing.html`** — alias for `/checkout.html` OR a cleaner pricing-only page (no deposit/BNPL flows). Demo footer "View Pricing" could be repointed.
3. **`/for-trades.html`** — vertical landing page for trades operators, modeled on `/for-barbers.html`. The Garage Door Kings demo becomes the social proof for this page.
4. **`/contact.html`** — minimal contact form OR explicit redirect to `/book.html`.

None of these are blockers for the demo consolidation work. The fallbacks chosen in Priority 3 produce a working funnel today.

---

## Decisions made autonomously in Priority 3 due to these gaps

(Documenting here per the run's instruction to capture autonomous decisions.)

| Decision | Reason |
|---|---|
| Demo banner CTA → `velonyxsystems.com/` (homepage) instead of `/services` | `/services` doesn't exist. Homepage hero immediately presents brand and links to all sections. |
| Footer "View Pricing" → `/checkout.html` instead of `/pricing` | `/pricing` doesn't exist. `/checkout.html` shows full pricing with checkout flow attached. |
| Floating "Book Consultation" → `/book.html` (no fallback needed) | Direct hit. |
| Contextual CTA on pay.html → `velonyxsystems.com/` (homepage) | Generic "see what we offer" pull, homepage is the strongest brand impression. |
| Did NOT build `/services.html`, `/pricing.html`, `/for-trades.html` | Outside scope of this run (instruction was AUDIT, not BUILD). Documented as gaps. |

---

## Verification commands

To re-confirm any of these results in the future:

```bash
# Check what exists
for p in services trades book contact pricing portfolio work about; do
  echo "${p}: $(curl -sI -o /dev/null -w "%{http_code}" "https://velonyxsystems.com/${p}.html")"
done

# Check anchors on the homepage
curl -s https://velonyxsystems.com/ | grep -oE 'id="(services|pricing|work|portfolio|contact|about)"' | sort -u
```

---

*Document version: April 29, 2026 — produced during autonomous demo consolidation run. No site files were modified during this audit.*
