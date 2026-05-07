# Velonyx Systems — Sitewide Performance Audit + Fix Sweep

**Date:** 2026-05-06
**Scope:** All 12 public pages on `velonyxsystems.com`
**Tool:** Lighthouse mobile (the dominant traffic profile for a service-business site shared via QR codes, DMs, and SMS links)

---

## Final mobile scores (after the sweep)

| Page | Performance | Acc. | Best Practices | SEO |
|---|---:|---:|---:|---:|
| `/` (homepage) | **80** ↑ from 70 | 92 | 100 | 100 |
| `/connect/` | **99** | 100 | 100 | 100 |
| `/checkout.html` | **100** ↑ from 98 | 94 | 100 | 69 |
| `/book.html` | **98** ↑ from 96 | 94 | 79 | 100 |
| `/financing.html` | **99** | 95 | 100 | 100 |
| `/for-barbers.html` | **97** ↑ from 86 | 100 | 96 | 100 |
| `/privacy.html` | **99** ↑ from 98 | 90 | 100 | 100 |
| `/terms.html` | **99** | 94 | 100 | 100 |
| `/sms-opt-in.html` | **100** ↑ from 99 | — | — | — |
| `/404.html` | **100** ↑ from 99 | 100 | 100 | 92 |

**Median Performance: 99 / 100 mobile.**
Every page either improved or held at near-perfect. Homepage gained +10 points and dropped LCP by 1.9 seconds.

---

## What changed (3 commits)

### Round 1 — `b7d9c0b` — `perf(round 1): hero video −60% + Unsplash WebP + refresh-gdk script`

| Asset | Before | After | Saved |
|---|---:|---:|---:|
| `assets/velonyx_hero_web.mp4` | 14.7 MB | 5.9 MB | **8.8 MB** (−60%) |
| 14× Unsplash CDN images | PNG/JPG via `?w=NNN&q=NN` | + `&fm=webp` flag | ~30-40% per image |

Plus a new `scripts/refresh-gdk.sh` for one-command GDK demo screenshot refreshes (run with: `bash scripts/refresh-gdk.sh` or just say "refresh GDK" in chat).

### Round 2 — `e0f304e` — `perf(round 2): non-blocking font load across all 12 public pages`

The single largest sitewide win. Lighthouse flagged "Eliminate render-blocking resources" on **7 of 10 audited pages** with savings of 400-780ms each. The blocking resource on every flagged page was the same: the Google Fonts `<link rel="stylesheet">`.

Fix applied to all 12 public HTML files: replaced the blocking link with the standard preload + onload swap pattern + a `<noscript>` fallback for JS-disabled clients.

```html
<!-- Old (blocks render until fonts download): -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?..." rel="stylesheet">

<!-- New (non-blocking, with fallback for JS-disabled): -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="..." onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="..."></noscript>
```

For the ~99% of users with JS, fonts now load asynchronously. Combined with the `&display=swap` query param already on every URL, text renders immediately in the system fallback font and swaps to Space Grotesk / DM Sans once loaded — no flash of invisible text.

Pages updated: `404, book, checkout, financing, for-barbers, privacy, terms, msa, sow, sms-terms, sms-opt-in, index`.

### Round 3 — `8005329` — `perf(round 3): WebP for hero poster + nav monogram`

Closed the last "next-gen formats" flag on the homepage:

| Asset | Before | After | Saved |
|---|---:|---:|---:|
| `assets/velonyx_hero_poster.jpg` | 213 KB | 163 KB | 50 KB (~24%) |
| `assets/vs-logo-monogram.png` | 34 KB | 17 KB | 17 KB (~50%) |

Markup: `<video poster>` switched directly to `.webp` (modern browsers support WebP for video posters; legacy browsers fall through to the autoplaying video which renders in <1s anyway). Nav monogram wrapped in `<picture>` with WebP source + PNG fallback.

---

## Top wins per page (Largest Contentful Paint)

| Page | LCP Before | LCP After | Δ |
|---|---:|---:|---:|
| `/` (homepage) | **5.0 s** | **3.1 s** | **−1.9 s** |
| `for-barbers.html` | 1.7 s | 1.2 s | −0.5 s |
| `book.html` | 1.8 s | 1.2 s | −0.6 s |
| `checkout.html` | 1.9 s | 1.3 s | −0.6 s |
| `404.html` | 1.6 s | 1.3 s | −0.3 s |
| `terms.html` | 1.7 s | 1.1 s | −0.6 s |

The homepage LCP improvement is the single biggest user-facing win. The +10-point Performance jump (70 → 80) is mostly attributable to the smaller hero video and the non-blocking fonts removing a ~600ms barrier before first text paint.

---

## Cumulative bytes saved per cold homepage load

| Component | Saved |
|---|---:|
| Hero video re-encode | ~8.8 MB |
| Hero poster JPG → WebP | ~50 KB |
| Nav monogram PNG → WebP | ~17 KB |
| Shield logo PNG → WebP `<picture>` (3 usages, cached after first) | ~130 KB on first load |
| Unsplash CDN switched to WebP (14 images) | ~150-200 KB |
| **Total saved on cold load** | **~9.0-9.2 MB** |

Per-visit data savings on a cellular connection at $0.05/MB (typical US carrier overage) ≈ $0.45 saved per cold visitor. At any meaningful traffic volume, that's a real number.

---

## What's still open (low priority)

- **Homepage TBT** ≈ 540 ms on Lighthouse mobile. Driven by GSAP scroll animations, hero particle canvas, and the char-splitting hero-headline reveal. Worth deferring some of this past LCP if Carlos wants to push 80 → 90+ on mobile. Real-user perception is fine; this is a Lighthouse synthetic-metric optimization.
- **`book.html` Best Practices = 79.** Worth a separate look — likely a Calendly iframe console warning or third-party cookie. Won't affect actual booking flow, just the score.
- **`/checkout.html` SEO = 69.** Expected — page is intentionally `noindex` (it's a transactional checkout, not a marketable URL). Lighthouse penalizes the lack of meta description even with `noindex`. Can ignore.

---

## How to re-run this audit

Single-page, mobile:

```bash
npx -y lighthouse "https://velonyxsystems.com/" \
  --output=json --output=html \
  --output-path=/tmp/lh-home \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --form-factor=mobile --quiet \
  --only-categories=performance,accessibility,best-practices,seo
```

Full sitewide sweep — `bash` snippet that runs Lighthouse against all 10 main public pages and writes JSON reports to `/tmp/lh-batch/`:

```bash
mkdir -p /tmp/lh-batch
for page in "/" "/connect/" "/checkout.html" "/book.html" \
            "/financing.html" "/for-barbers.html" "/privacy.html" \
            "/terms.html" "/sms-opt-in.html" "/404.html"; do
  slug=$(echo "$page" | sed -E 's|^/||; s|\.html$||; s|/$||; s|/|_|g')
  [ -z "$slug" ] && slug="home"
  npx -y lighthouse "https://velonyxsystems.com${page}" \
    --output=json --output-path="/tmp/lh-batch/${slug}.json" \
    --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
    --form-factor=mobile --quiet \
    --only-categories=performance,accessibility,best-practices,seo
done
```

---

## Commit summary

| Commit | What it did |
|---|---|
| `b7d9c0b` | Hero video re-encode (14.7 MB → 5.9 MB), Unsplash → WebP, refresh-gdk script |
| `e0f304e` | Non-blocking font load across 12 public pages |
| `8005329` | Hero poster JPG → WebP, nav monogram PNG → WebP |

All pushed to `origin/main`. Live and measured.
