# Garage Door Kings Demo — Deployment Architecture Audit

**Audit date:** April 29, 2026
**Auditor:** Claude (autonomous run)
**Scope:** Investigate why two URLs serve the Garage Door Kings demo and whether they share files.

---

## TL;DR

The two URLs are served by **two different platforms with two different codebases**. They are NOT a single source of truth today.

| URL | Platform | Source | Tech | Content match? |
|---|---|---|---|---|
| `https://velonyxsystems.com/demos/garage/` | **GitHub Pages** | `carlitolamar1989/velonyx-portfolio` repo, files at `/demos/garage/*` | Static HTML/CSS/JS | — |
| `https://gdk.velonyxsystems.com/` | **Vercel** | `velonyx-trades-template` repo (separate, untracked in main repo) | Next.js 14 + Supabase | **NO — different content** |

MD5 of homepages confirms divergence:
- `gdk.velonyxsystems.com/` → `99cc9e9593ce5e201485c41d109d46b1`
- `velonyxsystems.com/demos/garage/` → `300b325f0b07b2230a93d8cd02ceb91c`

---

## DNS resolution

```
$ dig +short gdk.velonyxsystems.com
cname.vercel-dns.com.
76.76.21.123
66.33.60.35

$ dig +short velonyxsystems.com
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

- Apex (`velonyxsystems.com`) → 4 GitHub Pages anycast IPs (185.199.108-111.153) — confirmed GitHub Pages.
- `gdk` subdomain → Vercel CDN (`cname.vercel-dns.com` / 76.76.21.123) — confirmed Vercel.

---

## HTTP response analysis

### `velonyxsystems.com/demos/garage/`
```
HTTP/2 200
server: GitHub.com
content-type: text/html; charset=utf-8
last-modified: Tue, 28 Apr 2026 12:40:42 GMT
etag: "69f0aaca-5efe"
cache-control: max-age=600
```
- `Server: GitHub.com` header confirms GitHub Pages origin.
- ETag matches a static file checksum.

### `gdk.velonyxsystems.com/`
```
HTTP/2 200
accept-ranges: bytes
access-control-allow-origin: *
age: 58495
cache-control: public, max-age=0, must-revalidate
content-disposition: inline
content-type: text/html; charset=utf-8
```
- No `Server: GitHub.com` header. Cache-control matches Vercel's edge CDN behavior.
- High `age` value indicates served from Vercel edge cache.

---

## File-level audit

### GitHub Pages source
Path in repo: `/Users/apple/Cursor-Claude/demos/garage/`

Pages present (12 HTML files):
- `index.html`
- `about.html`
- `services.html`
- `service-areas.html`
- `reviews.html`
- `contact.html`
- `portal.html` (customer portal)
- `admin.html` (operator dashboard)
- `admin-pay.html`
- `pay.html` (customer-facing payment)
- `invoices.html`

Plus `assets/` folder (images, css, js) and `config.js`.

This is a **vanilla HTML/CSS/JS single-page demo** served as static files via GitHub Actions workflow `.github/workflows/deploy.yml` (publishes the entire repo root as a Pages artifact on every push to `main`).

### Vercel source (separate codebase)
Path in repo dir tree: `/Users/apple/Cursor-Claude/velonyx-trades-template/`
Status in main repo: **untracked** (`?? velonyx-trades-template/` in `git status`)
Has its own `.git` directory — it's a **separate git repository**.

Stack indicators:
- `next.config.mjs`, `next-env.d.ts`, `package.json` ⇒ Next.js 14 app
- `vercel.json` ⇒ Vercel deployment with `framework: "nextjs"`
- `.vercel/` directory ⇒ already linked to a Vercel project
- `supabase/` directory ⇒ uses Supabase backend
- `tailwind.config.ts` ⇒ Tailwind CSS

The `vercel.json` shows:
```json
"git": { "deploymentEnabled": { "main": true } }
```
So this Vercel project auto-deploys from its own `main` branch.

This is a **completely different codebase** from the GitHub Pages demo. It is not a fork or copy of `/demos/garage/`. It appears to be a more complex Next.js + Supabase app that was built as a "trades template" and pointed at the `gdk` subdomain.

---

## Why this matters

1. **Bug surface doubled.** Any fix to the demo has to be made in two places.
2. **Feature drift inevitable.** The two versions WILL diverge as Carlos updates one but not the other.
3. **Conversion analytics fragmented.** Visitors from Reddit/social/cold-outreach who land on either URL fire pixels into different pipes.
4. **Branding inconsistency.** The two versions may not match in copy, screenshots, or trust signals.
5. **Cost.** Vercel free tier is fine but a paid Vercel project for a demo when GitHub Pages is free + already configured is unnecessary spend.

---

## Recommended consolidation path (executed in Priority 2)

**Make `/demos/garage/` the sole source of truth.** Configure `gdk.velonyxsystems.com` to redirect to `velonyxsystems.com/demos/garage/` (or to serve the same files via DNS routing).

Three options, ranked:

### Option A (recommended): Vercel-side redirect
Update `velonyx-trades-template/vercel.json` to add a global redirect rule sending all `gdk.velonyxsystems.com/*` → `https://velonyxsystems.com/demos/garage/$1`. Push to that repo's `main` and Vercel auto-deploys. Total time-to-effect: ~2 minutes.

**Drawback:** Requires push access to the separate Vercel-deployed repo. Carlos needs to run the push (or grant push access).

### Option B: DNS migration (slowest, cleanest)
Update DNS for `gdk.velonyxsystems.com` to CNAME → `carlitolamar1989.github.io`, then add `gdk.velonyxsystems.com` as an alternate domain in GitHub Pages settings. GitHub Pages serves the apex content under the subdomain, but Pages does not natively serve different paths under different subdomains — would need a JavaScript-based path router or a 301 redirect via meta tag at root.

**Drawback:** Most fragile; requires DNS change AND a JS/HTML hack to route subdomain traffic to a path on the apex.

### Option C: Take down the Vercel project
Decommission the Vercel deployment entirely. Remove the `gdk` subdomain or repoint it via DNS to a GitHub Pages CNAME for the apex. All gdk traffic 404s or gets caught by a wildcard rule.

**Drawback:** Loses the `gdk.*` brand-friendly URL.

**Decision for Priority 2:** Pursue **Option A** (Vercel redirect). This is the lowest-friction, fastest path to consolidation. Document DNS/Vercel commands Carlos must run in `SUBDOMAIN_SETUP.md` since pushing to a separate repo from this autonomous run is out of scope.

---

## What this audit does NOT change

- The GitHub Pages deployment continues to serve `/demos/garage/` from this repo. No change needed on the GitHub Pages side.
- This audit makes no DNS changes itself.
- This audit makes no commits to the `velonyx-trades-template` repo.

All actual consolidation work happens in Priority 2 (with documented DNS/Vercel steps for Carlos) and Priority 3 (CTA additions, which apply to the canonical `/demos/garage/` files).
