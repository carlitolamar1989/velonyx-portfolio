# Velonyx Demo Sites — Build Pattern

Reference for building new sales-asset demo sites under `/demos/<vertical>/`. Two demos use this pattern today:
- `/demos/smp/` — Apex SMP Studio (scalp micropigmentation)
- `/demos/garage/` — Garage Door Kings (Las Vegas trade business)

**Use this same pattern for every new vertical demo (HVAC Kings, Plumbing Kings, Med Spa, etc.) so they all clone the same way.**

---

## Core principle

These are **sales weapons, not production sites.** They look real, click real, but the backend is fully simulated. No real Twilio / Stripe / Resend / Calendly / Supabase / auth. When Carlos lands a paying client for a vertical, real services get wired in *then* — not before.

## Tech stack (locked)

- **Pure static HTML + vanilla CSS + vanilla JS.** No Tailwind, no React, no Next.js, no CDN dependencies, no build step.
- **Lives in `carlitolamar1989/velonyx-portfolio` repo** — same GitHub Pages deploy as the main Velonyx site.
- **Deploy**: push to `main` → GitHub Actions deploys in ~15s. Live at `velonyxsystems.com/demos/<vertical>/`.

## Standard file structure

```
/demos/<vertical>/
├── index.html            Homepage: hero · stats · services preview · service areas · reviews preview · final CTA
├── services.html         Detailed services page
├── service-areas.html    Geographic coverage (or equivalent for the vertical)
├── about.html            Founder / team story
├── reviews.html          Customer testimonials (renders from mock-data.js)
├── contact.html          Lead form with mock SMS confirmation overlay
├── portal.html           Customer portal (1 demo customer)
├── admin.html            Owner dashboard (full mock data tables)
├── config.js             Brand tokens — single source of truth
└── assets/
    ├── styles.css        Vanilla CSS, all components
    ├── mock-data.js      Leads / jobs / customers / estimates / SMS log / reviews
    ├── README.md         Asset notes (imagery, swap paths)
    ├── <logo>.png/svg    Brand logos
    └── favicon.png
```

## Required across every page

1. **Demo banner** at the very top of `<body>`:
   ```html
   <div class="demo-banner">DEMO — EXAMPLE DEPLOYMENT BY <a href="https://velonyxsystems.com">VELONYX SYSTEMS</a></div>
   ```
2. **`<meta name="robots" content="noindex, nofollow">`** in `<head>` so search engines don't index the demo
3. **Footer credit**: "Built by Velonyx Systems · This is a demonstration platform"
4. **Favicon + apple-touch-icon** linked in `<head>`
5. **Same nav** on every page (just bold/highlight the active link)

## Brand integration

`config.js` is the single source of truth. CSS custom properties in `styles.css` `:root` mirror the same hex values — keep them in sync. Cloning a new vertical = edit `config.js` colors + business identity, swap logos in `assets/`, and update copy. Done.

## Mock data conventions

- **Phone numbers**: always `XXX-555-XXXX` (FCC-reserved fake-number prefix; never accidentally rings a real person)
- **Names**: realistic ethnic diversity matching the target market
- **Addresses**: real neighborhoods/zip codes for the service area; fake street numbers
- **Dates**: relative to today via a `_d(daysOffset)` helper, so the demo always feels current. Never hardcode dates.
- **Lead status pipeline**: New / Contacted / Estimated / Won / Lost. Roughly 12 / 15 / 10 / 15 / 8 = 60 leads.
- **Other tables**: 8–15 jobs · 5–8 estimates · 15–20 customers · 30–50 SMS log entries · 8–12 review requests
- **Char-code helpers** (for generating phone tails, addresses, etc. from string IDs): always use `(id.charCodeAt(N) || 65)` fallback to avoid `NaN` → `Invalid Date` bugs

## Mocked interactions

The two patterns to reuse exactly as-is:

**Lead form → "Sending..." → "Request Received" overlay** (see `/demos/garage/contact.html`):
1. Form validates client-side (required fields, phone format, consent checkbox)
2. On valid submit: full-screen `.gdk-overlay` (or `.pay-overlay` in SMP) fades in
3. Stage 1 (1.6s): spinner + "Processing/Sending..."
4. Stage 2: gold checkmark burst animation + success message
5. Pre-populate the success screen with the user's actual entered data so it feels real

**Calendar/booking flow** (see `/demos/smp/book.html`):
- Render an in-page month-grid calendar that lets the user click a date
- After date selected, render time slots
- "Continue" disabled until both date AND time picked
- Selected date+time displayed in confirmation step

## Logo handling

If Carlos hands over Gemini-generated PNGs:
- They often have a **checker pattern baked in as opaque pixels** (Gemini exports the transparency preview as visible). Use Pillow to color-key the checker out:
  ```python
  # Keep only dark pixels (the wordmark/crown), transparent everything else
  for y in range(h):
      for x in range(w):
          r, g, b, a = pixels[x, y]
          if (r + g + b) / 3 > 130:   # Checker is medium-gray
              pixels[x, y] = (0, 0, 0, 0)  # Transparent
  ```
- For simple geometric marks (crowns, monograms): **convert to inline SVG** — perfectly transparent, scales infinitely, color via `currentColor` for theme inheritance
- For a dark logo on the demo's dark theme: invert via CSS filter
  ```css
  filter: invert(95%) sepia(10%) saturate(180%) hue-rotate(345deg) brightness(98%);
  ```
  The values produce warm cream from pure black (matches text color)

## Velonyx portfolio integration

After deploying a new demo, add a 6th/7th/Nth card to root `/index.html` "Featured Projects" section:
1. Copy an existing card's HTML structure
2. Update grid CSS to fit the new column count (e.g. `repeat(5, 1fr)` → `repeat(6, 1fr)` with new max-width breakpoints)
3. Update the section subtitle: `"N industries. N distinct brands. All built by Velonyx."`
4. Mirror to `/velonyx-website/index.html`

## Workflow for a new vertical

```bash
# 1. Branch off latest main
git checkout main && git pull
git checkout -b claude/<vertical>-demo

# 2. Copy the closest existing demo as a starting template
cp -r demos/garage demos/<vertical>

# 3. Edit demos/<vertical>/config.js — change brand identity, colors, services
# 4. Edit demos/<vertical>/assets/styles.css — update :root tokens to match
# 5. Edit page copy across all 8 HTML files — find/replace business name, swap services
# 6. Drop new logos in demos/<vertical>/assets/, update <img src> in pages
# 7. Update demos/<vertical>/assets/mock-data.js with vertical-appropriate names + services

# 8. Local preview to QA
python3 -m http.server 8080
# Open http://localhost:8080/demos/<vertical>/

# 9. Commit + add portfolio card + merge to main
git add demos/<vertical> index.html velonyx-website/index.html
git commit -m "Add <Vertical Brand> — Nth demo platform"
git push -u origin claude/<vertical>-demo
git checkout main && git merge --no-ff claude/<vertical>-demo
git push origin main
# GitHub Actions deploys automatically.
```

## What NOT to do

- ❌ Don't spin up a separate Next.js project for a demo (we tried this — wrong tool for this job)
- ❌ Don't add real Twilio/Stripe/Resend keys to a demo
- ❌ Don't use Tailwind CDN (it doesn't load reliably in some preview environments and adds 100KB of runtime JS for no real benefit)
- ❌ Don't use stock photos that misrepresent the vertical (e.g. haircut photos for an SMP demo)
- ❌ Don't hardcode dates in mock data — always use `_d()` helper offsets
- ❌ Don't deploy without the demo banner + noindex meta tag

## Files to reference when building a new vertical

| File | Why |
|---|---|
| `/demos/garage/admin.html` | Admin dashboard pattern — KPIs, filter chips, lead table, SMS log |
| `/demos/garage/contact.html` | Lead form + mock SMS overlay pattern |
| `/demos/smp/book.html` | In-page calendar + time picker pattern (Calendly replacement) |
| `/demos/smp/index.html` | Premium hero with cinematic gold orb, shimmer headlines |
| `/demos/garage/assets/mock-data.js` | Realistic mock data with `_d()` helper |
| `/demos/garage/config.js` | Brand-tokens-as-single-source-of-truth pattern |

---

**Last updated:** April 2026
**Maintained by:** Carlos / Velonyx Systems
