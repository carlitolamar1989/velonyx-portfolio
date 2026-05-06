# `/connect/` — Lighthouse audit baseline

**Date:** 2026-05-06
**URL audited:** `https://velonyxsystems.com/connect/`
**Tool:** `npx lighthouse` (Chrome headless, locally executed)

---

## Mobile (initial baseline — before logo optimization)

| Category | Score |
|---|---|
| Performance | **96 / 100** |
| Accessibility | 100 / 100 |
| Best Practices | 100 / 100 |
| SEO | 100 / 100 |

| Metric | Value |
|---|---|
| First Contentful Paint | 2.0 s |
| Largest Contentful Paint | 2.5 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0.002 |
| Speed Index | 2.1 s |
| Time to Interactive | 2.5 s |

## Desktop (initial baseline — before logo optimization)

| Category | Score |
|---|---|
| Performance | **69 / 100** |
| Accessibility | 100 / 100 |
| Best Practices | 100 / 100 |
| SEO | 100 / 100 |

| Metric | Value |
|---|---|
| First Contentful Paint | 2.1 s |
| Largest Contentful Paint | 3.1 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0.027 |
| Speed Index | 2.6 s |
| Time to Interactive | 3.1 s |

### Top desktop opportunities flagged (initial baseline)

| Opportunity | Savings | Cause |
|---|---|---|
| Properly size images | 820 ms / 168 KiB | `vs-logo-shield-clean.png` is 512×590 served at 120px display = 4× over-large |
| Serve images in next-gen formats | 650 ms / 132 KiB | PNG instead of WebP |
| Server response time | 114 ms (already fast) | GitHub Pages CDN — nothing to fix |

---

## Fix applied (same session)

Created two logo variants at the actual display size:

- `assets/vs-logo-shield-240.webp` — 22 KB (was 177 KB) → **88% reduction**
- `assets/vs-logo-shield-240.png` — 46 KB (PNG fallback for non-WebP browsers)

Updated `/connect/index.html` to use a `<picture>` element with WebP-first + PNG-fallback. Original `vs-logo-shield-clean.png` (512×590, 177 KB) is preserved for use by other pages (`index.html`, `book.html`, `404.html`, etc.).

The original `index.html` and other pages were intentionally NOT touched in this pass — they can adopt the same optimization in a future sweep.

---

## After fix — re-audit results (same session)

### Mobile (after fix)

| Category | Before | After | Δ |
|---|---|---|---|
| Performance | 96 | **97** | +1 |
| Accessibility | 100 | 100 | — |
| Best Practices | 100 | 100 | — |
| SEO | 100 | 100 | — |

LCP: 2.5s → **2.1s** (–0.4s)

### Desktop (after fix)

| Category | Before | After | Δ |
|---|---|---|---|
| Performance | 69 | **83** | **+14** |
| Accessibility | 100 | 100 | — |
| Best Practices | 100 | 100 | — |
| SEO | 100 | 100 | — |

LCP: **3.1s → 1.8s** (–1.3s, ~42% improvement)
Speed Index: 2.6s → 1.8s
FCP: 2.1s → 1.8s

### Remaining desktop opportunity

| Opportunity | Savings |
|---|---|
| Properly size images | 80 ms / 16 KiB |

The remaining drag is a few extra logo pixels (240w is still slightly larger than the 120px display target on a non-retina desktop) plus Google Fonts being a render-blocking external CSS. Going from 83 → 95+ on desktop would require either:

1. A smaller logo variant (e.g., 180w WebP, ~12 KB) — easy
2. Self-host the fonts and inline an `@font-face` declaration — more invasive

Neither is critical given the page is a "link in bio" / business-card-style funnel that's overwhelmingly accessed on mobile (where Performance is now 97).

---

## How to re-run

```bash
# Mobile
npx -y lighthouse "https://velonyxsystems.com/connect/" \
  --output=json --output=html \
  --output-path=/tmp/lh-connect-mobile \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --form-factor=mobile --quiet \
  --only-categories=performance,accessibility,best-practices,seo

# Desktop
npx -y lighthouse "https://velonyxsystems.com/connect/" \
  --output=json --output=html \
  --output-path=/tmp/lh-connect-desktop \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --form-factor=desktop --screenEmulation.disabled \
  --throttling.cpuSlowdownMultiplier=1 --quiet \
  --only-categories=performance,accessibility,best-practices,seo
```

---

## Recommended for the broader site (separate follow-up)

The same `--properly-size-images` + `--next-gen-formats` opportunities apply to the homepage's hero usage of `vs-logo-shield-clean.png`. A follow-up pass on `index.html`, `book.html`, etc. could shave hundreds of KB and nudge their Lighthouse scores up the same way. Out of scope for this commit.
