/**
 * APEX SMP STUDIO — Demo Config
 * ─────────────────────────────────────────────────────────────
 * This is the ONLY file Carlos needs to edit manually before the
 * demo goes live for prospect outreach.
 *
 * SETUP CHECKLIST (5 minutes):
 *
 * 1. Create Calendly event type:
 *    - Title: "Apex SMP Demo Consultation"
 *    - Duration: 30 minutes
 *    - Copy the inline embed URL (looks like https://calendly.com/your-name/apex-smp-demo)
 *    - Paste it into CALENDLY_EMBED_URL below
 *
 * 2. In Stripe Dashboard → Payment Links (TEST MODE toggled on):
 *    - Create 3 one-time Payment Links with these exact amounts:
 *         $750   (Hairline deposit — 50% of $1,500)
 *         $1,750 (Full Scalp deposit — 50% of $3,500)
 *         $3,000 (Advanced deposit — 50% of $6,000)
 *    - Copy each buy.stripe.com URL
 *    - Paste them into the 3 STRIPE_*_DEPOSIT_URL fields below
 *
 * 3. Save this file. The demo auto-wires everything else.
 *
 * Test card for Stripe Test Mode: 4242 4242 4242 4242
 *                                  Any future expiry, any CVC
 * ─────────────────────────────────────────────────────────────
 */
window.DEMO_CONFIG = {
  CALENDLY_EMBED_URL: "REPLACE_WITH_CALENDLY_URL",

  STRIPE_HAIRLINE_DEPOSIT_URL:  "REPLACE_WITH_750_LINK",
  STRIPE_FULLSCALP_DEPOSIT_URL: "REPLACE_WITH_1750_LINK",
  STRIPE_ADVANCED_DEPOSIT_URL:  "REPLACE_WITH_3000_LINK",

  // Sanity check: warn in console if Carlos hasn't edited this file yet
  _unconfigured() {
    const placeholders = [
      this.CALENDLY_EMBED_URL,
      this.STRIPE_HAIRLINE_DEPOSIT_URL,
      this.STRIPE_FULLSCALP_DEPOSIT_URL,
      this.STRIPE_ADVANCED_DEPOSIT_URL,
    ];
    return placeholders.filter(v => v.startsWith("REPLACE_WITH_"));
  }
};

if (window.DEMO_CONFIG._unconfigured().length > 0) {
  console.warn(
    "[APEX SMP DEMO] Config placeholders still present. " +
    "Edit /demos/smp/config.js before sharing demo publicly. " +
    `Unconfigured: ${window.DEMO_CONFIG._unconfigured().length}/4`
  );
}
