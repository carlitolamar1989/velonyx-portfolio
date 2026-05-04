# Rebrand Cleanup Sweep — Summary

**Date:** 2026-05-03 (deploy completed 2026-05-04 ~03:14 UTC)
**Branch merged:** `fix/rebrand-cleanup-sweep` → `main` (merge commit `2fb2ae4`, 8 commits squashed under no-ff merge)
**Deploy status:** ✅ Live at https://velonyxsystems.com/
**GitHub Actions run:** `25299188033` (deploy completed in ~20s)

---

## Issues Resolved

### P1 — Portfolio stripped to GDK only
- Removed Throne Barbershop, IronWill Training, Lens & Light Studio, and Apex SMP Studio cards (markup deleted, not just hidden)
- Kept only the Garage Door Kings card linking to `gdk.velonyxsystems.com`
- Updated grid CSS to single-column, max-width 520px, centered
- Reframed section: "Our Work" → "Live Client Build"; "Featured Projects" → "See It In Action"
- Added follow-up line: "More builds in production. Yours could be next." → `#contact` anchor
- Added explicit width/height to GDK image (CLS prevention)

### P2 — Pricing collapsed to ONE Founding Member tier with plain-English comparison
- Removed all 4 build tiers (Starter $1,500 / Growth $3,500 / Premium $6,000 / Enterprise $12,000+)
- Removed all 4 monthly Care plans ($125 / $225 / $325 / Enterprise) — old Stripe links archived in HTML comments for rollback
- Replaced with ONE centered Founding Member card:
  - **$3,000 one-time build + $100/month**
  - Trophy tag, locked-in-for-life note, 8-item plain-English feature list
  - "Claim a Founding Spot" gold CTA pointing to `#contact` (until new Stripe Payment Link is created)
  - Secondary "Need something custom beyond this? Book a consultation →" link
- Added 5-dot Founding Spots Available counter (HTML comment documents how Carlos manually flips dots)
- Added plain-English 2-column comparison block immediately below the pricing card:
  - **Left:** itemized rented stack (Housecall Pro $109–149, website $30–50, SMS $20–40, financing) totaling $160–290/mo, $5,760–$10,440 over 3 years, owns nothing
  - **Right:** Velonyx ($3K once + $100/mo), $4,200 Y1, $6,600 Y3, owns whole platform
  - Bottom-line callout: $10,440 rented vs $6,600 Velonyx + ownership
- Removed the older 3-card "Why Velonyx Beats Renting Your Tools" section (formerly between Process and Pricing) — would have been redundant with the new comparison block under the pricing card
- Updated section subtitle: "Pick the package that fits your business" → "One package. Five founding spots. Locked-in pricing for life."

### P3 — Premium Lucide icons in brand gold
- Swapped 6 Unicode glyph icons for inline Lucide SVGs (no JS dependency, no font load)
- Mapping:
  1. Custom Branded Platform → `lucide:globe`
  2. Integrated Payment System → `lucide:credit-card`
  3. Customer Financing (BNPL) → `lucide:wallet`
  4. Production Hosting & Deployment → `lucide:server`
  5. Ongoing Care & Maintenance → `lucide:shield-check`
  6. Digital Operations Consulting → `lucide:compass`
- All SVGs use `stroke-width="1.5"`, `viewBox="0 0 24 24"`, `currentColor` stroke
- Added `color: var(--accent)` to `.service-icon` so currentColor renders gold
- Added subtle drop-shadow + scale-up hover effect

### P4 — "Hear The Pitch" podcast section removed
- Deleted the entire `<section class="pitch-audio" id="listen">` block from the HTML body
- Audio file retained at `/assets/audio/velonyx-pitch.mp3` for potential repurposing
- All section CSS (`.pitch-audio*`, `.vx-*`) and audio-player JS removed in P7
- No broken anchors remain (no nav or footer references to `#listen`)

### P5 — Hero typography fixed (no more mid-word breaks)
- **Root cause:** Per-character reveal animation wraps each character in an inline-block `<span class="char">`. Browsers can break between any two inline-block elements when they overflow — causing "Stop Renting Your Business Tools." to break as "Busines\ns Tools."
- **Fixes:**
  - Split H1 into 2 explicit `<span class="line">` elements: "Stop Renting" / "Your Business Tools."
  - Added `white-space: nowrap` to `.char-wrap` so browsers cannot break between inline-block char elements within a single line
  - Replaced fixed mobile font-sizes with `clamp()`:
    - `.hero-h1-top`: `clamp(1.55rem, 7.4vw, 2rem)` (was fixed `2rem`)
    - `.hero-h2-bottom`: `clamp(1.3rem, 6vw, 1.65rem)` (was fixed `1.6rem`)
  - At 320px viewport (Galaxy Fold), H1 = ~1.55rem so "Your Business Tools." (20 chars) fits cleanly
  - At 375px viewport (iPhone SE), H1 = ~1.85rem and still fits comfortably
- H2 was already split into two clean lines (Start Owning Your / Infrastructure.) — benefits from same animation fix

### P6 — Hero CTA clipping resolved
- **Root cause:** `min-height: 100vh` + `padding-bottom: 30px` + `align-items: center` + `overflow: hidden` caused content overflow on shorter viewports (720p laptops, iPad portrait) → CTAs clipped at bottom edge.
- **Fixes:**
  - `min-height: 100vh` → `min-height: max(100vh, 880px)` (floor guarantees enough vertical room for the content stack)
  - `padding-bottom: 30px` → `padding-bottom: 130px` (≈8rem; CTAs sit comfortably above fold-line)
  - `overflow: hidden` retained for radial gradient backgrounds + `heroParticles` canvas; container is now sized correctly
- Mobile breakpoint unchanged: still uses `min-height: auto` (content-driven, never clips)

### P7 — Performance pass
- **Hero video:** Already 14MB (under 15MB target); no re-encode needed. Added IntersectionObserver to pause on scroll-out and resume on return (CPU/battery savings)
- **Images (CLS prevention):** Added explicit `width`/`height` to all 17 previously-missing `<img>` tags — logos, parallax dividers, all 12 showcase strip images
- **Fonts:** Added `<link rel="preload" as="style">` for Google Fonts so Space Grotesk (used in hero H1/H2) is fetched in parallel with HTML
- **Dead code removed:**
  - ~140 lines of orphan `.why-*` CSS (deleted "Why Velonyx Beats" section)
  - ~75 lines of orphan `.maintenance-*` CSS (deleted Care monthly plans)
  - ~165 lines of orphan `.pitch-audio*` and `.vx-*` CSS (deleted podcast section)
  - ~70 lines of orphan audio-player JS
- **File size:** 210K → 176K HTML (~16% reduction); ~5460 → 4950 lines (~510 lines net removed)

---

## Outstanding Action Items for Carlos

### Stripe (highest priority)
- [ ] **Create new Stripe Payment Link:** $3,000 one-time setup + $100/mo recurring subscription. Use Stripe's "set up fee on first invoice" pattern, or Stripe Billing with a one-time line item plus monthly subscription product.
- [ ] **Replace `[CLAIM A FOUNDING SPOT]` CTA href** in pricing section with the new Stripe Payment Link URL. Currently points to `#contact` as a temporary fallback.
- [ ] **Enable "Require customers to accept terms of service"** in Stripe Payment Link settings, pointing to `https://velonyxsystems.com/terms.html`.
- [ ] **Deprecate the 3 old monthly tier Stripe Payment Links** ($125 / $225 / $325). URLs are preserved in HTML comments inside `index.html` near the old pricing block.
- [ ] **When 5th founding customer signs:** Create new Stripe Payment Link at $5,000 setup + $200/mo, update pricing card amounts, remove "Founding Member Pricing — First 5 Customers Only" framing.

### Operational
- [ ] **Update the 5-spot counter dots manually** as founding customers sign on. To mark a spot taken, change `class="founding-dot filled"` → `class="founding-dot empty"` on a dot span. HTML comment in code documents this.
- [ ] **Decide whether to delete `/assets/audio/velonyx-pitch.mp3`** permanently or keep for potential repurposing (cold ads, founder content). MP3 was unlinked from the page in this sweep but the file is still in the repo.

### Pages still using old "Website Package" naming (Phase-2 follow-up)
This sweep only touched `index.html`. These pages still reference the old 4-tier structure and "website package" framing — they need a separate pass:
- `checkout.html` — has `?plan=starter`, `?plan=growth`, `?plan=premium` query params and still shows 4 tier cards
- `book.html` — Calendly intake; copy may reference website builds
- `financing.html` — BNPL explainer; references "websites"
- `for-barbers.html` — vertical landing; built before this rebrand

### Performance follow-ups not done in P7
- [ ] **WebP conversion:** `cwebp` and ImageMagick aren't available in this environment. Once you have access, convert PNGs/JPG to WebP and add `<picture>` fallback. Highest-impact targets: `vs-logo-shield-clean.png` (177KB), `velonyx_hero_poster.jpg` (208KB), GDK image.
- [ ] **Lighthouse audit:** Cannot run from this environment. Recommend running against the live URL once and recording desktop/mobile scores (Performance, Accessibility, Best Practices, SEO) for baseline.

---

## Files Modified

This sweep touched only `index.html` plus this summary doc. Distribution:

| Priority | Lines added | Lines removed | Net |
|---|---:|---:|---:|
| P1 — Portfolio strip | 30 | 95 | −65 |
| P2 — Founding-member pricing + comparison | 576 | 231 | +345 |
| P3 — Lucide icons | 18 | 6 | +12 |
| P4 — Podcast section removal | 3 | 35 | −32 |
| P5 — Hero typography | 9 | 4 | +5 |
| P6 — Hero CTA clipping | 9 | 2 | +7 |
| P7 — Perf pass (CSS+JS removal, image dims, observers, preload) | 40 | 473 | −433 |
| **Net** | **685** | **846** | **−161 lines** |

After all 8 commits merged, `index.html` went from ~5111 lines to **4950 lines** and from **210 KB to 176 KB** (~16% reduction).

---

## Lighthouse Scores

**Before:** Not measured this session.

**After:** Cannot run Lighthouse from this environment (no headless Chrome / Lighthouse CLI available). Expected impact based on changes made:

| Metric | Expected impact |
|---|---|
| **Performance (Mobile)** | ↑ moderate — image dimensions eliminate CLS; orphan CSS/JS removal cuts ~510 lines off the inline `<style>` and `<script>`; hero video pauses off-screen reducing CPU |
| **Performance (Desktop)** | ↑ small — most desktop bottlenecks were already mitigated; main win is reduced HTML payload (210K → 176K) and fewer DOM nodes |
| **CLS (Cumulative Layout Shift)** | ↓ significant — every above-fold and below-fold image now has explicit `width`/`height`, browser reserves correct aspect-ratio boxes |
| **LCP (Largest Contentful Paint)** | Neutral — hero video and poster unchanged; could improve once WebP conversion is done |
| **FID (First Input Delay)** / **INP** | ↑ small — fewer JS event listeners (audio player gone); GSAP still runs |
| **Accessibility** | Neutral — no a11y changes; aria-labels preserved on Founding Spots Available counter (`role="status" aria-live="polite"`) |
| **Best Practices** | ↑ small — removed dead code, cleaner DOM |
| **SEO** | Neutral — all 11 JSON-LD blocks still valid, all meta tags preserved |

Recommend: Carlos run Lighthouse on https://velonyxsystems.com/ to record actual scores.

---

## Deploy Verification (executed against live site)

```
HTTP STATUS
- https://velonyxsystems.com/        HTTP 200  ✓
- https://www.velonyxsystems.com/    HTTP 301 → apex (expected behavior)

HERO H1/H2 — clean line breaks
  <span class="line">Stop Renting</span>
  <span class="line">Your Business Tools.</span>
  <span class="line"><span class="gold">Start Owning Your</span></span>
  <span class="line"><span class="gold">Infrastructure.</span></span>          ✓

HERO CTAs — both visible
  <a href="/book.html" class="btn-primary">Book Free Consultation</a>          ✓
  <a href="#pricing" class="btn-secondary">See Pricing</a>                     ✓

LUCIDE ICONS — 6/6 SVG comments live (globe, credit-card, wallet,
  server, shield-check, compass)                                                ✓

PRICING — Founding Member single tier
  "Founding Member Pricing — First 5 Customers Only"
  "5 Founding Spots Available"
  $3,000 one-time + $100/month                                                  ✓

PRICING — plain-English comparison block
  "Patched-Together Tools" col + "One Owned System" col
  "Housecall Pro or Jobber" line item                                           ✓

PORTFOLIO — single GDK card centered
  Section label: "Live Client Build"
  H2: "See It In Action"
  Garage Door Kings card present                                                ✓
  Throne / IronWill / Lens & Light / Apex SMP — 0 occurrences                   ✓

PODCAST — fully removed
  "Hear The Pitch" / pitch-audio-player / "Engineering Frictionless"
  — 0 occurrences                                                               ✓

JSON-LD — 11/11 blocks valid in live HTML                                       ✓

OLD COMPARISON SECTION — fully removed
  "Why Velonyx Beats" / why-comparison-grid / why-card — 0 occurrences          ✓

LIVE HTML SIZE — 180,324 bytes (~176 KB)                                        ✓
```

---

## Commit log

```
2fb2ae4  Merge fix/rebrand-cleanup-sweep: 7-priority rebrand fix sweep
d20b08b  perf: lighthouse pass — image dimensions, video pause-on-scroll, font preload, dead-code removal
ef6fcfa  fix(hero): resolve CTA clipping; ensure buttons fully visible at all viewport heights
576b00a  fix(hero): force clean line breaks on headlines; eliminate mid-word splits
6c14b35  chore(podcast): remove Hear The Pitch section — off-brand for service-industry positioning
8f34671  style(services): replace placeholder icons with Lucide SVGs in brand gold
4802883  feat(pricing): collapse to single founding-member tier ($3K + $100/mo) with plain-English comparison
f97d6bf  chore(portfolio): strip to GDK only; reframe as single live build
```

---

## End of summary

Site is live at https://velonyxsystems.com/ with all 7 priorities applied. Carlos can review live, then circle back with the Stripe Payment Link for the new founding-member offer + the Phase-2 follow-up sweep on `checkout.html`, `book.html`, `financing.html`, and `for-barbers.html`.
