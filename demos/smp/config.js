/**
 * APEX SMP STUDIO — Demo Config
 * ─────────────────────────────────────────────────────────────
 * This demo is FULLY SELF-CONTAINED.
 *
 * - The date/time picker on the booking page (step 2) renders a live
 *   calendar in-browser. Pick a date, pick a time — nothing hits
 *   Calendly or any external scheduler.
 *
 * - The "Confirm Booking & Pay Deposit" button on step 6 shows an
 *   in-page payment-processing overlay with a spinner, success
 *   checkmark, and auto-advance to the confirmation screen. Nothing
 *   hits Stripe, Checkout.com, or any external processor. No card
 *   data is ever entered or transmitted.
 *
 * Nothing to edit in this file to run the demo. It's kept around as a
 * marker + future extension point if a real Calendly / Stripe / other
 * integration is added later.
 * ─────────────────────────────────────────────────────────────
 */
window.DEMO_CONFIG = {
  SELF_CONTAINED: true,
  VERSION: '2.0',
  // Future hooks — unused in the current fully-simulated demo:
  CALENDLY_EMBED_URL: null,
  STRIPE_HAIRLINE_DEPOSIT_URL: null,
  STRIPE_FULLSCALP_DEPOSIT_URL: null,
  STRIPE_ADVANCED_DEPOSIT_URL: null,
};
