# Rebrand Deploy Verification — 2026-05-03

**Push:** `e2b1aeb..8ec2df1` to `origin/main`
**GitHub Actions run:** `25291988336` ("Add site + portal diagnostic audit doc" — covers all 6 rebrand commits)
**Deploy duration:** 19s job time
**Deploy completed:** 2026-05-03 ~21:59:50 UTC
**Verified live:** 2026-05-03 21:59:50 UTC (poll exit)

---

## HTTP status

| URL | Status |
|---|---|
| `https://velonyxsystems.com/` | **HTTP 200** ✓ |
| `https://www.velonyxsystems.com/` | **HTTP 301** (redirects to apex — expected behavior for GitHub Pages with apex CNAME) ✓ |

---

## New positioning live in `<head>`

| Tag | Live value |
|---|---|
| `<title>` | `Velonyx Systems \| Custom Business Systems for Service Operators` ✓ |
| `<meta name="description">` | "Velonyx engineers custom business systems for service operators. Integrated platform: payments, customer management, SMS, SEO, branded website. Owned by you, not rented. Your Legacy, Engineered With Precision." ✓ |
| `<meta property="og:title">` | matches new title ✓ |
| `<meta property="og:description">` | matches new description ✓ |
| `<meta property="og:image">` | `https://velonyxsystems.com/assets/vs-logo-shield-clean.png` (was Unsplash placeholder) ✓ |
| `<meta name="twitter:title">` | matches new title ✓ |
| `<meta name="twitter:description">` | matches new description ✓ |

---

## Hero section live

```
<div class="hero-slogan">Your Legacy, Engineered With Precision.</div>
<div class="hero-eyebrow"><span class="dot"></span> Custom Business Systems for Service Operators</div>
<h1 class="hero-h1-top">
    <span class="line">Stop Renting Your Business Tools.</span>
</h1>
...
<h2 class="hero-h2-bottom">
    <span class="line"><span class="gold">Start Owning Your</span></span>
    <span class="line"><span class="gold">Infrastructure.</span></span>
</h2>
<p class="hero-sub">Velonyx engineers custom business systems for service operators — one integrated platform that replaces the patchwork of tools running your business. Booking, payments, customer management, invoicing, SMS automation, and a premium branded website. All connected. All branded as you. All owned by you. Your legacy, engineered with precision.</p>
```
✓ Hero verified live verbatim against the spec.

---

## Services section live

H2: "One System. Six Integrated Capabilities." ✓
Subhead: "Velonyx isn't a website company. We engineer the complete operating system that runs your service business." ✓

---

## "Why Velonyx" section live

Section-label: "Rent vs Own" ✓
H2: "Why Velonyx Beats Renting Your Tools" ✓
3-card comparison grid live (Patched-Together SaaS / Custom Software Agency / Velonyx Foundation Tier) ✓
Summary block + "See How Much You'd Save →" CTA pointing to `#pricing` ✓

---

## About section live

H2: "Engineered Legacies, Not Rented Software." ✓
Body rewritten around custom business systems for service operators with vertical examples (garage door, HVAC, plumbing, electrical, landscaping). ✓

---

## FAQ section live

| Question | Live |
|---|---|
| "How long does it take to build my system?" | ✓ |
| "Do I own the system after it's built?" | ✓ |
| "Can my customers pay through my system?" | ✓ |
| "What happens after my system launches?" | ✓ |
| "Why should I choose Velonyx over SaaS tools like Housecall Pro, ServiceTitan, or Jobber?" | ✓ |

FAQPage JSON-LD updated to match all visible questions. ✓

---

## JSON-LD validity (live HTML)

- **Live site has 11 JSON-LD blocks**
- **Valid: 11/11** ✓

Verified by parsing the live HTML response with `python3 json.loads` against every `<script type="application/ld+json">` block.

---

## humans.txt live

Updated with new positioning line: "We engineer custom business systems for service operators." ✓
Tier names changed to Starter/Growth/Premium/Enterprise **System** (not "Website Package"). ✓

---

## Final sign-off

All 6 priority commits pushed, deployed, and verified live on `https://velonyxsystems.com/`. The new "rent vs own" positioning is the dominant brand message across `<title>`, hero, services, the new comparison section, About, FAQ, schema, and humans.txt. No HTTP errors, no broken JSON-LD, no malformed HTML detected in the live response.
