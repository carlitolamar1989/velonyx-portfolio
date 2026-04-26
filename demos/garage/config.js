/**
 * GARAGE DOOR KINGS — Demo Config
 * ─────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH for the Garage Door Kings demo.
 *
 * This file is the template Carlos clones to spin up a new
 * trade-vertical demo (HVAC Kings, Plumbing Kings, Electrician
 * Kings, etc.). Change the values below, swap the photos in
 * /demos/garage/assets/, and you have a new vertical demo.
 *
 * The demo is FULLY SELF-CONTAINED:
 *   - No real Twilio SMS (lead form simulates a success state)
 *   - No real Stripe checkout (estimate flow simulates a paid state)
 *   - No real Resend email (admin shows email previews only)
 *   - No real Supabase auth (customer/admin portals jump straight in)
 *
 * If a real client buys this template, swap mock functions for real
 * API calls. All mock function signatures are named so the swap is
 * surgical.
 * ─────────────────────────────────────────────────────────────
 */
window.GARAGE_CONFIG = {

  // ─── BUSINESS IDENTITY ──────────────────────────────────────
  business: {
    name: 'Garage Door Kings',
    tagline: 'Las Vegas’s Most Trusted Garage Door Specialists',
    shortName: 'GDK',
    owner: 'Marcus Reed',         // Admin portal demo user
    customerDemo: 'Michael Robinson', // Customer portal demo user
    phone: '(702) 555-0184',      // Fake 555 prefix per FCC convention
    phoneTel: '+17025550184',     // tel: link format
    email: 'service@garagedoorkings.com',
    address: '4280 W Sahara Ave, Suite 12, Las Vegas, NV 89102',
    hours: 'Mon–Fri 7am–7pm · Sat 8am–3pm · 24/7 Emergency',
    yearsInBusiness: 12,
    licenses: 'Nevada State Contractors Board #00789432 · Bonded · Insured',
  },

  // ─── BRAND TOKENS (also mirrored in styles.css :root vars) ──
  // Change these together if you want a different palette.
  // The CSS variables in /demos/garage/assets/styles.css use the
  // same exact values — keep them in sync if you tweak.
  colors: {
    background: '#0A0A0A',     // Page bg
    text: '#F5F0E8',           // Primary text (warm cream, easier on eyes than pure white)
    accent: '#B8732E',         // Brand copper/burnt-orange (industrial, masculine, Vegas sunset)
    accentBright: '#D4843A',   // Hover/active accent
    accentPale: '#F2C998',     // For text gradients + soft highlights
    secondary: '#3A3A3A',      // Secondary surfaces
    secondaryDark: '#1A1A1A',  // Card backgrounds
    border: 'rgba(245, 240, 232, 0.08)', // Subtle borders
    borderAccent: 'rgba(184, 115, 46, 0.3)',
  },

  // ─── TYPOGRAPHY ─────────────────────────────────────────────
  // Fraunces is a high-contrast modern serif (industrial-display feel).
  // Inter is the body workhorse (clean sans-serif).
  // Both load from Google Fonts in each page's <head>.
  fonts: {
    display: '"Fraunces", Georgia, "Times New Roman", serif',
    body: '"Inter", system-ui, -apple-system, sans-serif',
  },

  // ─── LOGO PATHS ─────────────────────────────────────────────
  // Drop logo files in /demos/garage/assets/ with these names.
  // For Phase 1, we'll use a CSS-rendered wordmark if no logo exists yet.
  logos: {
    primary: '/demos/garage/assets/gdk-logo.svg',         // Full logo with mark + wordmark
    mark: '/demos/garage/assets/gdk-mark.svg',            // Just the icon/monogram
    wordmark: '/demos/garage/assets/gdk-wordmark.svg',    // Just the text
    favicon: '/demos/garage/assets/favicon.png',
  },

  // ─── SERVICE AREAS (Las Vegas neighborhoods) ────────────────
  serviceAreas: [
    'Las Vegas',
    'Henderson',
    'Summerlin',
    'Paradise',
    'Spring Valley',
    'Enterprise',
    'North Las Vegas',
    'Boulder City',
  ],

  // ─── SERVICES (used for menu, lead-form dropdowns, mock data) ─
  services: [
    { id: 'emergency',  name: 'Emergency Repair',   priceFrom: 89,   description: 'Same-day service. Spring breaks, off-track doors, broken openers — we’re on the way in 2 hours or less.' },
    { id: 'spring',     name: 'Spring Replacement', priceFrom: 285,  description: 'Torsion + extension springs. 5-year warranty on parts and labor.' },
    { id: 'opener',     name: 'Opener Install',     priceFrom: 489,  description: 'Belt drive, chain drive, or smart wifi-enabled. LiftMaster, Chamberlain, Genie.' },
    { id: 'new-door',   name: 'New Door Install',   priceFrom: 1450, description: 'Steel, wood-look, full-view glass. Insulated and non-insulated. Free in-home design consult.' },
    { id: 'commercial', name: 'Commercial Doors',   priceFrom: 2400, description: 'Roll-up, sectional, and high-cycle commercial doors. Industrial-grade, fast turnaround.' },
    { id: 'maintenance',name: 'Maintenance Plans',  priceFrom: 149,  description: 'Annual tune-up plans. Lube, balance, safety check. Catches small problems before they become emergencies.' },
  ],

  // ─── FUTURE EXTENSION HOOKS (unused in demo; here for cloning later) ─
  // When a real client buys this template, fill these in:
  twilio:   { ENABLED: false, ACCOUNT_SID: null, AUTH_TOKEN: null, PHONE_NUMBER: null },
  stripe:   { ENABLED: false, PUBLISHABLE_KEY: null, SECRET_KEY: null },
  resend:   { ENABLED: false, API_KEY: null, FROM_ADDRESS: null },
  supabase: { ENABLED: false, URL: null, ANON_KEY: null },

  // Marker so the cookie banner / analytics know the demo state
  SELF_CONTAINED: true,
  VERSION: '0.1.0-phase0',
};

if (typeof console !== 'undefined') {
  console.log('%c[Garage Door Kings Demo]%c v' + window.GARAGE_CONFIG.VERSION + ' — self-contained, no real backend calls.',
    'color:#B8732E;font-weight:bold;', 'color:#999;');
}
