# Demo Consolidation — Deployment Verification

**Verification run:** April 29, 2026, 21:26 UTC
**Verifier:** Claude (autonomous run, Priority 5)
**Branch verified:** `consolidation-deploy` (PR #5 — pending Carlos's review/merge)

---

## TL;DR

The autonomous run completed all code work and pushed it to a feature branch + opened PR #5. **Live deployment is blocked at the final push step** because the Claude Code harness blocks direct `git push` to `main` (requires PR review per repository policy). All other steps verified locally on the `consolidation-deploy` branch.

| Step | Status |
|---|---|
| 4 priority branches merged into `consolidation-deploy` with `--no-ff` | ✅ Done locally |
| `consolidation-deploy` pushed to `origin` | ✅ Done |
| PR #5 opened against `main` | ✅ Done — https://github.com/carlitolamar1989/velonyx-portfolio/pull/5 |
| `git push origin main` | ❌ Blocked by harness |
| GitHub Pages deploy of new CTAs | ⏳ Awaits PR #5 merge |
| Vercel redirect for gdk subdomain | ⏳ Awaits Carlos running steps in `SUBDOMAIN_SETUP.md` |
| `https://velonyxsystems.com/demos/garage/` returns 200 | ✅ Yes (still serving pre-CTA version until merge) |
| `https://gdk.velonyxsystems.com/` returns 200 | ✅ Yes (still serving old Vercel content until redirect added) |
| Both URLs serve identical content | ❌ Not yet — see "expected vs actual" below |

---

## Curl results (live as of verification time)

### `https://velonyxsystems.com/demos/garage/`
```
HTTP/2 200
server: GitHub.com
content-type: text/html; charset=utf-8
last-modified: Tue, 28 Apr 2026 12:40:42 GMT
etag: "69f0aaca-5efe"
cache-control: max-age=600
```
- ✅ 200 OK
- ✅ Served by GitHub Pages
- ⚠️ `last-modified` is Apr 28 — predates today's CTA work (Apr 29). This is expected: the new CTAs are on the `consolidation-deploy` branch, not yet on `main`.

### `https://gdk.velonyxsystems.com/`
```
HTTP/2 200
content-type: text/html; charset=utf-8
age: 62613
cache-control: public, max-age=0, must-revalidate
```
- ✅ 200 OK
- ✅ Served by Vercel (no `Server: GitHub.com` header)
- ⚠️ `age: 62613` (~17 hours of cache) — Vercel edge serves stale content from the old `velonyx-trades-template` Next.js app. This is expected: the documented redirect (in `SUBDOMAIN_SETUP.md`) has not yet been applied.

### Content match check
```
PATH md5:  300b325f0b07b2230a93d8cd02ceb91c
GDK md5:   99cc9e9593ce5e201485c41d109d46b1
```
- ❌ MD5s diverge — different content. Single source of truth not yet achieved.
- This is expected and will be resolved when:
  1. Carlos merges PR #5 (path version updates with new CTAs), AND
  2. Carlos applies the Vercel redirect from `SUBDOMAIN_SETUP.md` (subdomain begins 301-redirecting to path version).

After both steps complete, the gdk subdomain will redirect (HTTP 301/308) to `velonyxsystems.com/demos/garage/`, and downstream content will match because both URLs effectively resolve to the same destination.

---

## Local verification (what's committed but not yet deployed)

On `consolidation-deploy` branch:

```
$ grep -c "demo-banner-cta\|gdk-footer-vlx-cta\|gdk-floating-book\|gdk-vlx-contextual-cta" demos/garage/index.html
11
```

Eleven matches confirms the new CTA classes are present in `index.html` (and the same pattern holds across all 11 demo pages — banner-cta + footer-vlx-cta with eyebrow/headline/sub/buttons + floating-book + contextual on admin/portal/pay).

```
$ git log --oneline | head -8
8ca4d06 Merge: Priority 4 — funnel page gaps audit
a37e138 Merge: Priority 3 — conversion CTAs across all 11 demo pages
8cfe3ab Merge: Priority 2 — consolidation setup doc (subdomain redirect)
e329fb9 Merge: Priority 1 — document dual-deployment audit
3fc2332 Audit Velonyx Systems site funnel pages
2c7b09f Add clear conversion pathways from demo back to Velonyx Systems
c053e35 Consolidate Garage Door Kings demo to single source of truth
2cf86d1 Document current dual-deployment state of Garage Door Kings demo
```

All 4 priorities merged into `consolidation-deploy` with `--no-ff` (preserving merge-commit history per the original instruction).

---

## CTA URL verification (link targets)

All demo CTAs added in Priority 3 verified against the gap audit in `VELONYX_SITE_GAPS.md`:

| CTA | Target URL | Live status |
|---|---|---|
| Demo banner "See What We'd Build For You" | `https://velonyxsystems.com/` | ✅ 200 |
| Footer "Book a Free Consultation" | `https://velonyxsystems.com/book.html` | ✅ 200 |
| Footer "View Pricing" | `https://velonyxsystems.com/checkout.html` | ✅ 200 |
| Floating "Book Consultation" | `https://velonyxsystems.com/book.html` | ✅ 200 |
| admin.html contextual CTA | `https://velonyxsystems.com/book.html` | ✅ 200 |
| portal.html contextual CTA | `https://velonyxsystems.com/book.html` | ✅ 200 |
| pay.html contextual CTA | `https://velonyxsystems.com/` | ✅ 200 |

**Zero CTAs in this run point to a 404.** All fallbacks for the missing `/services`, `/trades`, `/contact`, `/pricing`, `/portfolio`, `/work` pages route to either the homepage or `/checkout.html`, both confirmed live.

---

## What still needs to happen

### For the GitHub Pages side (path version)

1. Merge PR #5 (https://github.com/carlitolamar1989/velonyx-portfolio/pull/5).
2. GitHub Actions auto-deploys on push to `main` (~90 seconds).
3. Re-curl `https://velonyxsystems.com/demos/garage/` and verify a NEW `last-modified` timestamp + presence of the new CTAs in the served HTML:
   ```bash
   curl -s https://velonyxsystems.com/demos/garage/ | grep -c "demo-banner-cta\|gdk-floating-book"
   # Should output a positive integer (currently 0 in production)
   ```

### For the Vercel side (subdomain version)

1. Run the Vercel redirect steps from `docs/SUBDOMAIN_SETUP.md` (5-minute change in `velonyx-trades-template/vercel.json`, push, Vercel auto-deploys).
2. Re-curl `https://gdk.velonyxsystems.com/` and verify it returns 301/308 with `location: https://velonyxsystems.com/demos/garage/`:
   ```bash
   curl -sI https://gdk.velonyxsystems.com/ | head -5
   # Expected: HTTP/2 301 (or 308), location: https://velonyxsystems.com/demos/garage/
   ```

### Post-both-steps verification

After both deployments complete, both URLs effectively resolve to identical content:
- Direct visit to `velonyxsystems.com/demos/garage/` serves the new demo with CTAs.
- Direct visit to `gdk.velonyxsystems.com/` 301-redirects to the same URL.
- Browser address bar in both cases lands on the canonical path URL.

---

## Why the autonomous run could not complete the final push

The Claude Code harness running this autonomous task blocks `git push origin main` with the following policy message:

> "Pushing directly to the repository default branch (main) bypasses pull request review, which is a BLOCK condition; the user's autonomous-mode instruction did not specifically authorize pushing to main vs. a feature branch + PR."

The user's task instruction did include "Push to origin/main" as part of Priority 5, but the harness's repository-policy guard rule supersedes per-task instructions. The autonomous run pivoted to:

1. Push the consolidated `consolidation-deploy` branch (containing all 4 priority merges).
2. Open PR #5 against `main` with full description + test plan.
3. Document this hand-off here so Carlos can complete the final merge with a single click.

This is the correct safety behavior. The PR review gate exists precisely for cases like this.

---

*Document version: April 29, 2026 — produced during autonomous demo consolidation run, Priority 5 of 5.*
