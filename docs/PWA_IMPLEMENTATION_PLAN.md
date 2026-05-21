# PWA Implementation Plan — Garage Door Kings Pilot

**Target codebase:** `/Users/apple/Cursor-Claude-trades-template/` (the Next.js portal repo behind `gdk.velonyxsystems.com` on Vercel)

**Goal:** Convert the GDK admin portal into a Progressive Web App so the owner can install it on their phone, get push notifications for new leads / bookings / payments, and use it offline. This is the pilot — once GDK is working, templatize for client #2.

This doc is the step-by-step recipe. Open it alongside the portal repo and work through it top to bottom.

---

## Context

The portal at `gdk.velonyxsystems.com` is already a Next.js 14 app on Vercel. It has the owner admin views (leads, bookings, payments, customers) under `/admin/*` and is mobile-friendly. Adding the PWA layer means: a manifest, a service worker, app icons, web push subscriptions, and a push-fanout from the existing leads/bookings webhooks. **Owner-facing only at launch** — customers continue to interact via the public site, not the PWA.

Once installed, the owner gets:
- An app icon on their home screen (no App Store needed)
- Background push notifications for new leads, new bookings, and payment received
- Offline shell access (the dashboard skeleton loads even with no signal — data refreshes when back online)
- Tap a push notification → opens directly to the relevant view (deep linked)

---

## Pre-flight checklist

| # | Item | Action |
|---|---|---|
| 1 | App icon source | A square version of the Garage Door Kings logo, minimum 1024×1024 PNG with transparent or solid background. If you don't have one, export it from your design files or have one generated. |
| 2 | Brand color | The hex for the GDK brand (probably the copper/black tone matching the live site). Check the GDK portal's existing `tailwind.config.js` for the theme color or grab from the rendered hero. |
| 3 | VAPID keys | Generate once for Velonyx. Same keys reused across all client PWAs. Run: `npx web-push generate-vapid-keys` → save both `publicKey` and `privateKey` as Vercel env vars on the GDK project (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT=mailto:admin@velonyxsystems.com`) |
| 4 | Web Push npm package | Add `web-push` to the portal's `package.json` (`npm install web-push`) |
| 5 | Supabase migration | Add a `push_subscriptions` table to the GDK Supabase project (see schema below) |
| 6 | Notification permission UX | iOS Safari has special handling — see "iOS install flow" below |

---

## Files to add to the GDK portal repo

### 1. `public/manifest.json`

```json
{
  "name": "Garage Door Kings — Owner Portal",
  "short_name": "GDK Portal",
  "description": "Take payments, see bookings, check leads — anywhere.",
  "start_url": "/admin",
  "scope": "/admin/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#0C0C0F",
  "background_color": "#0C0C0F",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/apple-touch-icon-180.png", "sizes": "180x180", "type": "image/png" }
  ],
  "categories": ["business", "productivity"]
}
```

**Notes:**
- `start_url` is `/admin` so opening the app from the home screen lands in the dashboard, not the public site.
- `scope` restricts the PWA shell to admin pages only. Tapping a customer-facing link opens it in a regular browser, not the app shell.
- `theme_color` matches the dark mode of the admin portal.

### 2. `public/icons/` — 4 PNG files

Generate from the source logo with Pillow (or any image tool):

| File | Size | Purpose |
|---|---|---|
| `icon-192.png` | 192×192 | Android home screen |
| `icon-512.png` | 512×512 | Android splash + high-density |
| `icon-512-maskable.png` | 512×512 | Android adaptive icon (with safe-zone padding — keep logo within central 80%) |
| `apple-touch-icon-180.png` | 180×180 | iOS home screen |

If you want, you can run a one-shot Pillow script to generate all four from the source logo. Mirror the pattern in `velonyx-portfolio/scripts/process_logos.py`.

### 3. `public/sw.js` — Service worker

```js
// Garage Door Kings PWA service worker
const CACHE_NAME = 'gdk-portal-v1';
const APP_SHELL = [
  '/admin',
  '/admin/leads',
  '/admin/bookings',
  '/admin/payments',
  '/admin/customers',
  '/icons/icon-192.png',
  '/manifest.json'
];

// Install: cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API + data, cache-first for shell assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // API routes — always network first, fall back to error
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request).catch(() => new Response(JSON.stringify({ offline: true }), { headers: { 'Content-Type': 'application/json' } })));
    return;
  }
  // Shell assets — cache first, network fallback
  if (event.request.method === 'GET' && url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return resp;
      }))
    );
  }
});

// Push event — show notification + deep link
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); }
  catch (e) { payload = { title: 'New activity', body: event.data.text() }; }

  const options = {
    body: payload.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: payload.tag || 'gdk-general',
    data: { url: payload.url || '/admin' },
    requireInteraction: payload.urgent === true
  };
  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// Click on a push notification — focus the app or open the URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/admin';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes('/admin') && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
```

### 4. `app/admin/layout.tsx` — Register the service worker + install prompt

Add at the bottom of the existing admin layout (or wherever it currently mounts):

```tsx
'use client';
import { useEffect } from 'react';

export function PwaBootstrap() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration failed', err);
      });
    }

    // iOS Safari install prompt — show once per session if not installed
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone === true
      || window.matchMedia('(display-mode: standalone)').matches;
    if (isIos && !isStandalone && !sessionStorage.getItem('gdk_ios_install_shown')) {
      sessionStorage.setItem('gdk_ios_install_shown', '1');
      // Render a toast: "Tap Share → Add to Home Screen to install GDK"
      // (Use whatever toast component the portal already has, or a custom one)
    }
  }, []);

  return null;
}
```

Then in `app/admin/layout.tsx`:

```tsx
import { PwaBootstrap } from './pwa-bootstrap';

export default function AdminLayout({ children }) {
  return (
    <>
      <PwaBootstrap />
      {children}
    </>
  );
}
```

### 5. `app/api/push/subscribe/route.ts` — Save the push subscription

```ts
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  const { endpoint, keys } = body;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: 'invalid subscription' }, { status: 400 });
  }

  await supabase.from('push_subscriptions').upsert({
    user_id: session.user.id,
    endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
    user_agent: req.headers.get('user-agent') || '',
    updated_at: new Date().toISOString()
  }, { onConflict: 'endpoint' });

  return NextResponse.json({ ok: true });
}
```

### 6. `app/api/push/send/route.ts` — Internal push fanout

```ts
import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createServerSupabase } from '@/lib/supabase';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// Internal endpoint — called from leads/bookings/payments webhooks.
// Protected via shared secret header.
export async function POST(req: Request) {
  if (req.headers.get('x-internal-secret') !== process.env.INTERNAL_PUSH_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const { title, body, url, tag, ownerUserId } = await req.json();

  const supabase = createServerSupabase();
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', ownerUserId);

  if (!subs?.length) return NextResponse.json({ sent: 0 });

  const payload = JSON.stringify({ title, body, url, tag });
  const results = await Promise.allSettled(
    subs.map((s) =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload
      )
    )
  );

  // Clean up subscriptions that returned 410 Gone
  const gone = results
    .map((r, i) => (r.status === 'rejected' && (r.reason as any)?.statusCode === 410 ? subs[i].endpoint : null))
    .filter(Boolean);
  if (gone.length) {
    await supabase.from('push_subscriptions').delete().in('endpoint', gone);
  }

  return NextResponse.json({ sent: results.filter((r) => r.status === 'fulfilled').length });
}
```

### 7. Hook push fanout into existing webhooks

In the existing lead-intake / booking / payment handler routes, after the lead is saved to Supabase, add a fire-and-forget call to `/api/push/send`:

```ts
// Inside the existing lead-creation handler, after saving:
fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/push/send`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-internal-secret': process.env.INTERNAL_PUSH_SECRET! },
  body: JSON.stringify({
    title: 'New lead',
    body: `${lead.firstName} ${lead.lastName} — ${lead.service || 'General inquiry'}`,
    url: `/admin/leads/${lead.id}`,
    tag: 'new-lead',
    ownerUserId: '<the GDK owner user_id>'
  })
}).catch(() => {});
```

Repeat for the booking handler (`title: 'New booking'`, `url: '/admin/bookings/<id>'`) and payment handler (`title: 'Payment received'`, `body: '$X from <customer>'`, `url: '/admin/payments/<id>'`).

### 8. Supabase migration — `push_subscriptions` table

```sql
create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index on push_subscriptions(user_id);
```

### 9. Subscription UI — somewhere in `/admin/settings`

A toggle that calls the existing `pushManager.subscribe()` flow:

```tsx
async function enablePush() {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  });
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sub)
  });
}
```

Render a "Enable push notifications" button. On click, request notification permission, subscribe, save.

---

## Push notification event types (per the locked plan)

| Event | Title | Body template | URL deep link |
|---|---|---|---|
| New lead submitted | `New lead` | `{firstName} {lastName} — {service}` | `/admin/leads/{id}` |
| New booking made | `New booking` | `{customerName}, {service}, {time}` | `/admin/bookings/{id}` |
| Payment received | `Payment received` | `${amount} from {customerName}` | `/admin/payments/{id}` |

These three are the locked set. Configurable per-event opt-in (let the owner mute one type) is documented as a v2 enhancement below.

---

## iOS install flow

iOS Safari (15.4+) supports Web Push for installed PWAs but **never shows an install prompt** like Android does. The owner must manually:

1. Open `gdk.velonyxsystems.com` in Safari (not Chrome or any other browser — only Safari can install PWAs on iOS)
2. Tap the Share icon
3. Scroll down → tap **Add to Home Screen**
4. Confirm

Show a toast or modal in `/admin` on iOS Safari that walks them through this on first session. The PwaBootstrap component above (item 4) has the detection logic. The toast copy:

> **Install the GDK Portal app**  
> Tap the Share icon below, then "Add to Home Screen" to install. You'll get push notifications for new leads, bookings, and payments.

Once installed, push notifications work the same as Android.

## Android install flow

Android Chrome auto-shows an install banner after the user visits a few times. No custom UX needed. The owner taps "Install" and the icon lands on their home screen.

---

## Testing checklist

| # | Test | Expected |
|---|---|---|
| 1 | Open `gdk.velonyxsystems.com/admin` on Android Chrome | After ~2 visits, an "Install" banner appears |
| 2 | Tap Install on Android | Icon lands on home screen, opens to `/admin` |
| 3 | Open admin on iOS Safari | iOS toast appears: "Tap Share → Add to Home Screen" |
| 4 | Add to Home Screen on iOS | Icon lands on home screen, opens to `/admin` standalone (no Safari chrome) |
| 5 | Toggle Enable push in `/admin/settings` on installed app | Permission prompt → granted → subscription saved to Supabase |
| 6 | Submit a fake lead via public form | Push notification arrives on phone within ~3 seconds |
| 7 | Tap the notification | App opens directly to `/admin/leads/<id>` |
| 8 | Disable wifi + open app | Cached admin shell loads; API returns "offline: true" gracefully |
| 9 | Re-enable wifi → push notification while app is closed | Notification still arrives |
| 10 | Lighthouse PWA audit | Score ≥ 90, no critical issues |

---

## Effort estimate

Per the original scope, ~7 working days, broken down:

| Phase | Days |
|---|---|
| Manifest, icons, service worker | 1 |
| Web Push subscription API + Supabase schema | 1 |
| Push fanout endpoint + hook into leads/bookings/payments webhooks | 1 |
| Subscription UI in admin settings | 0.5 |
| iOS install toast UX | 0.5 |
| Per-PWA route caching strategy + offline fallbacks | 1 |
| Per-event opt-in UI (mute lead / booking / payment) | 1 (deferred to v2) |
| Cross-browser testing (iOS Safari, Android Chrome, desktop Chrome) | 1 |
| **Total (MVP, no opt-in)** | **~6 days** |
| **Total (with opt-in)** | **~7 days** |

---

## Templatize for client #2

Once GDK is working, cloning to a new client takes:

1. **New folder** in the portal repo (or new env per client if the codebase serves multi-tenant)
2. **Replace icons** in `public/icons/` with client's logo
3. **Update `manifest.json`** name, short_name, theme_color, start_url
4. **Same service worker** — no change
5. **Same push subscription API** — multi-tenant via `user_id` already
6. **Same web push fanout** — multi-tenant
7. **Hook into client-specific lead/booking/payment webhooks** if separate

In practice, the per-client work is ~30 minutes once the recipe is proven. The bulk of the effort is the one-time GDK pilot.

---

## Future enhancements (v2+)

- **Per-event opt-in** — let the owner mute one notification type
- **Quiet hours** — auto-mute notifications between 9pm and 7am unless `urgent: true`
- **Critical/non-critical** classification — payment received = critical, low-balance = non-critical
- **Bundled summary** — instead of a notification per event, send a daily roll-up at 7am ("3 new leads, 2 bookings, $1,400 paid")
- **Customer-facing PWA** — let homeowners install a customer-facing version (book service, see history, pay invoices) — separate manifest, separate scope, separate fanout rules
- **Apple Wallet pass integration** — for repeating-service customers (maintenance plans)
- **Native voice dictation** of lead notes from the install prompt

These are deliberately deferred. Ship the MVP first; the owner experience already wins big from the 3 core notifications + offline shell.

---

## Open questions to confirm before starting

1. **Owner user_id in Supabase** — Carlos needs to confirm the specific `user_id` for GDK's owner account so the push fanout targets the right person. (Or change `ownerUserId` to look up by `business_id` if there's a clients table mapping businesses → owners.)
2. **Booking webhook hook** — Does the existing booking handler emit anything we can listen to, or do we need to add the fanout call inline? (Likely inline, same as the lead handler.)
3. **Payment webhook source** — Stripe webhooks fire on `payment_intent.succeeded`. Make sure that webhook is wired into the portal and we know which file to add the push fanout to.
4. **VAPID key storage** — Vercel env vars work. Want them encrypted via Vercel's KMS, or plain env? Plain is fine for VAPID.

Resolve these before starting the build. The rest of this plan is unchanged regardless of the answers.

---

## Status

- [ ] Pre-flight checklist complete (icons generated, VAPID keys created, Supabase migrated)
- [ ] manifest.json + sw.js committed
- [ ] PwaBootstrap component registers the SW
- [ ] /api/push/subscribe live
- [ ] /api/push/send live + hooked into leads, bookings, payments
- [ ] Subscription UI live in /admin/settings
- [ ] iOS install toast live
- [ ] Lighthouse PWA score ≥ 90
- [ ] Carlos installs on personal phone, validates the 3 push types end-to-end
- [ ] Templatization notes finalized for client #2
