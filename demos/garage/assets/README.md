# `demos/garage/assets/` — imagery & styles

Phase 0 ships only `styles.css`. Image files come in Phase 2+ when the homepage and services pages are built.

## What's already here

| File | Purpose |
|---|---|
| `styles.css` | Vanilla CSS shared across every page in `/demos/garage/`. Mirrors the Apex SMP demo pattern. CSS custom properties at the top of the file mirror `config.js` color tokens — keep in sync. |

## Imagery plan (Phase 2+)

The Garage Door Kings demo will use the same approach as the Apex SMP demo:

1. **Stock + AI-generated photography** from royalty-free sources (Unsplash, Pexels) and tools like Midjourney for hero shots.
2. **Realistic but generic** — never use real garage door companies' photos or real client photos without consent.
3. **Las Vegas context** — desert backdrops, suburban homes, daylight + golden-hour lighting where possible.

### Expected files (drop in this folder when ready)

| Name | Where used | Notes |
|---|---|---|
| `gdk-logo.svg` | Header, footer, favicon | Optional — Phase 0 uses CSS-rendered "GDK" mark. SVG preferred. |
| `gdk-mark.svg` | Compact logo (favicon, mobile) | Optional. |
| `hero-truck.jpg` | Homepage hero | A GDK-branded service truck in front of a Vegas-style home. AI-generate for fastest path. |
| `service-emergency.jpg` | Services page | Emergency repair scene — broken spring, technician on scene. |
| `service-spring.jpg` | Services page | Spring replacement up close. |
| `service-opener.jpg` | Services page | Opener install — modern wifi opener. |
| `service-newdoor.jpg` | Services page | New door installation in progress. |
| `service-commercial.jpg` | Services page | Commercial roll-up door. |
| `about-marcus.jpg` | About page + admin avatar | Portrait of "Marcus Reed" the owner. Stock photo, mid-40s male, friendly. |
| `customer-michael.jpg` | Customer portal | Portrait of "Michael Robinson" the demo customer. |
| `review-{1..6}.jpg` | Reviews page | Headshot avatars or use CSS-generated initials circles like SMP demo did. |

### What won't ship as files (use CSS/SVG instead)

- Service area map → use a CSS map composition or embedded Mapbox/Google static map link
- Trust badges → CSS-styled pills with text
- Star ratings → text + CSS gold stars

## Mock data

`mock-data.js` lands in Phase 7 (Admin Dashboard). It will contain:
- 40-60 mock leads (statuses: New 12 / Contacted 15 / Estimated 10 / Won 15 / Lost 8)
- 8-12 mock active jobs across the next 30 days
- 5-8 mock estimates (Draft / Sent / Approved / Declined)
- 15-20 mock customers with Las Vegas names + neighborhoods
- 30-50 mock SMS log entries
- 8-12 mock review request entries

All phone numbers will use `702-555-XXXX` format (FCC-reserved fake-number prefix).
All addresses will be in: Henderson, Summerlin, Paradise, Spring Valley, Enterprise, North Las Vegas, Boulder City.
