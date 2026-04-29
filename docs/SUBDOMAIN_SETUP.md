# gdk.velonyxsystems.com — Subdomain Consolidation Setup

**Purpose:** Make `https://gdk.velonyxsystems.com/` and `https://velonyxsystems.com/demos/garage/` serve identical content by redirecting all `gdk.*` traffic to the canonical `/demos/garage/` path on the main site.

**Owner action required:** Yes — Carlos must run the DNS/Vercel steps below. Until those are run, the subdomain continues to serve the older Next.js app from the separate Vercel deployment, while the canonical demo at `/demos/garage/` continues to serve correctly from GitHub Pages.

**This file is documentation. The autonomous run added the CTAs and other site changes already; the only outstanding task is this DNS/Vercel work.**

---

## Why both URLs exist

See `DEPLOYMENT_AUDIT.md` for full architecture analysis. Short version:

- `velonyxsystems.com` apex → GitHub Pages → this repo (`carlitolamar1989/velonyx-portfolio`)
- `gdk.velonyxsystems.com` → Vercel → separate `velonyx-trades-template` repo (Next.js + Supabase)

Today the two URLs serve **different content** (different MD5s). After this setup runs, the gdk subdomain will 301-redirect to the canonical path version on the main site, eliminating drift.

---

## Recommended path: Vercel-side redirect (5 minutes)

### Step 1 — Open the trades template repo

```bash
cd /Users/apple/Cursor-Claude/velonyx-trades-template
git status
git remote -v
```

Confirm you're in the separate `velonyx-trades-template` repo and remember its remote (probably also a GitHub repo under `carlitolamar1989` org).

### Step 2 — Edit `vercel.json`

Open `vercel.json` in that directory. Add a top-level redirect rule to the existing `redirects` array. The completed `vercel.json` should include:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "regions": ["iad1"],
  "buildCommand": "next build",
  "installCommand": "npm ci",
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  },
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://velonyxsystems.com/demos/garage/$1",
      "permanent": true,
      "has": [
        {
          "type": "host",
          "value": "gdk.velonyxsystems.com"
        }
      ]
    }
  ],
  "headers": [
    /* ...keep existing headers as-is... */
  ]
}
```

The new redirect rule:
- Catches every path on `gdk.velonyxsystems.com`
- 301-redirects to the equivalent path on `velonyxsystems.com/demos/garage/`
- `permanent: true` returns HTTP 301 (search engines treat as permanent move + cache)
- `has` clause restricts the redirect to the gdk hostname only — apex Vercel previews/aliases stay unaffected

### Step 3 — Commit and push to the trades-template repo

```bash
git add vercel.json
git commit -m "Redirect gdk subdomain to canonical /demos/garage/ on main site"
git push origin main
```

Vercel auto-deploys from the `main` branch (per `vercel.json`'s `git.deploymentEnabled` setting). Deploy completes in ~90 seconds.

### Step 4 — Verify the redirect

After Vercel finishes deploying:

```bash
curl -sI https://gdk.velonyxsystems.com/
# Expected output should include:
# HTTP/2 308  (or 301)
# location: https://velonyxsystems.com/demos/garage/
```

And in a browser, navigating to `https://gdk.velonyxsystems.com/` should land on `https://velonyxsystems.com/demos/garage/` after a brief redirect.

---

## Alternative paths (NOT recommended, documented for completeness)

### Alternative B — DNS-only redirect via Cloudflare Page Rules

If you prefer to bypass Vercel entirely and use Cloudflare in front of Namecheap:

1. Add `velonyxsystems.com` as a domain in Cloudflare (free plan).
2. Update Namecheap nameservers to point to Cloudflare.
3. In Cloudflare, create a Page Rule:
   - URL: `gdk.velonyxsystems.com/*`
   - Setting: **Forwarding URL** → 301 → `https://velonyxsystems.com/demos/garage/$1`
4. Decommission the Vercel project (optional).

**Drawback:** Adds Cloudflare as a dependency for the entire apex domain. Higher operational complexity than the Vercel-side redirect.

### Alternative C — Take down Vercel, point gdk at GitHub Pages

GitHub Pages supports exactly **one** custom domain per repo, and that's `velonyxsystems.com` already (per the `CNAME` file at repo root). It cannot serve `gdk.velonyxsystems.com` directly without losing the apex.

You could add a second GitHub Pages repo just for the subdomain, but that contradicts the goal of single source of truth. **Don't do this.**

---

## Post-redirect: cleaning up the Vercel project

After Step 4 verifies the redirect works for at least 7 days with no issues, optionally:

1. Delete the Vercel project at vercel.com → Velonyx Trades Template → Settings → Delete.
2. Remove the `gdk` DNS record from Namecheap.
3. The redirect now lives only in DNS history; the subdomain effectively no longer resolves and the main site at `velonyxsystems.com/demos/garage/` is the single source of truth.

**OR** keep the Vercel project alive as a low-cost safety net (free tier, no traffic, just the redirect rule). Either is fine.

---

## Verification checklist for Carlos

- [ ] DNS for `gdk.velonyxsystems.com` still resolves
- [ ] `curl -I https://gdk.velonyxsystems.com/` returns 301 or 308 with `location: https://velonyxsystems.com/demos/garage/`
- [ ] Browser navigation from `gdk.velonyxsystems.com` lands on `velonyxsystems.com/demos/garage/`
- [ ] Both URLs render the same demo (because the gdk one redirects to the path one)
- [ ] All sub-paths redirect: e.g., `gdk.velonyxsystems.com/admin` → `velonyxsystems.com/demos/garage/admin` (note: GitHub Pages serves `admin.html` so the redirect should go to `/demos/garage/admin.html` — the `(.*)` pattern handles this)

---

## Until Carlos runs these steps

The gdk subdomain continues to serve the old Next.js Vercel app. Visitors who land there see a different (and stale) version. Drive all marketing/outreach to `velonyxsystems.com/demos/garage/` (the canonical URL) until the redirect is live.

The autonomous run added all CTA/conversion improvements to `/demos/garage/`. They are live on the canonical URL today.
