/* Velonyx Meta Pixel — standard conversion-event helpers + auto-wiring.
 * ==================================================================
 *
 * Sits on top of the base Pixel installed by /assets/cookie-consent.js
 * once the visitor accepts CCPA cookie consent. Everything in here is a
 * no-op until then — window.fbq is undefined and window.vxTrack guards
 * its own fbq call, so we just dev-log and return.
 *
 * Public API on window.velonyx:
 *   - trackLead()              — "Claim a Founding Spot" intent
 *   - trackViewContent()       — pricing modal becomes visible (1× per session)
 *   - trackContact()           — book.html link / mailto / tel / social /
 *                                contact-form submit / Calendly booking
 *   - trackInitiateCheckout()  — Stripe payment link or /checkout.html nav
 *
 * Naming matches Meta's standard events case-for-case so Events Manager
 * recognises them without custom-event setup:
 *   https://developers.facebook.com/docs/meta-pixel/reference#standard-events
 *
 * Each helper calls window.vxTrack(...) from cookie-consent.js, which
 * fans out to BOTH window.fbq and window.gtag — so we get the same
 * conversion event in Meta Events Manager and Google Analytics 4 from
 * one call.
 *
 * Auto-wiring runs once on DOMContentLoaded and uses click-event
 * delegation on <document>. New CTAs added later automatically get
 * tracked as long as their href / class matches the patterns below.
 * ================================================================== */
(function() {
  if (typeof window === 'undefined') return;

  // ── Dev-mode detection ─────────────────────────────────────────────
  // We can't reach process.env in a static site, so we approximate
  // "development" with a hostname check. Production = velonyxsystems.com.
  var IS_DEV = (function() {
    try {
      var h = (window.location && window.location.hostname) || '';
      return (
        h === 'localhost' ||
        h === '127.0.0.1' ||
        h === '0.0.0.0' ||
        h.endsWith('.local') ||
        h.endsWith('.test')
      );
    } catch (e) { return false; }
  })();

  function devLog(eventName, params) {
    if (!IS_DEV) return;
    if (typeof console === 'undefined' || !console.log) return;
    console.log('[velonyx-pixel]', eventName, params || {});
  }

  // Single dispatcher: prefer the existing window.vxTrack helper (which
  // fires fbq + gtag in one call). Fall back to direct fbq if vxTrack
  // somehow isn't loaded yet. Always dev-log the intent regardless of
  // whether the network call goes out.
  function fire(eventName, params) {
    devLog(eventName, params);
    try {
      if (typeof window.vxTrack === 'function') {
        window.vxTrack(eventName, params);
      } else if (typeof window.fbq === 'function') {
        window.fbq('track', eventName, params);
      }
    } catch (e) {
      // Tracking failures must never break a real user interaction.
    }
  }

  // ── Public helpers ─────────────────────────────────────────────────
  function trackLead() {
    fire('Lead', {
      content_name: 'Founding Spot Claim',
      content_category: 'Velonyx System',
      value: 3000,
      currency: 'USD'
    });
  }

  // Throttled to once per browser session — the modal can be re-opened
  // (e.g. via a future button) but we don't want to double-count.
  function trackViewContent() {
    var FLAG = 'velonyx_pixel_viewcontent_fired';
    try {
      if (sessionStorage.getItem(FLAG) === '1') return;
      sessionStorage.setItem(FLAG, '1');
    } catch (e) {
      // Private browsing — sessionStorage throws; let the event fire anyway.
    }
    fire('ViewContent', {
      content_name: 'Velonyx System Pricing',
      content_category: 'Pricing',
      value: 3000,
      currency: 'USD'
    });
  }

  function trackContact() {
    fire('Contact', {
      content_name: 'Contact Inquiry',
      content_category: 'Lead Generation'
    });
  }

  function trackInitiateCheckout() {
    fire('InitiateCheckout', {
      content_name: 'Velonyx System Checkout',
      value: 3000,
      currency: 'USD'
    });
  }

  window.velonyx = window.velonyx || {};
  window.velonyx.trackLead = trackLead;
  window.velonyx.trackViewContent = trackViewContent;
  window.velonyx.trackContact = trackContact;
  window.velonyx.trackInitiateCheckout = trackInitiateCheckout;

  // ── Auto-wiring ────────────────────────────────────────────────────
  function getHref(el) {
    if (!el || !el.getAttribute) return '';
    return (el.getAttribute('href') || '').toLowerCase();
  }

  function nearestActionableAncestor(el) {
    // Walk up to the nearest <a> or <button>. Bail if we leave the doc.
    while (el && el !== document.body) {
      var tag = el.tagName;
      if (tag === 'A' || tag === 'BUTTON') return el;
      el = el.parentElement;
    }
    return null;
  }

  function bindClicks() {
    document.addEventListener('click', function(e) {
      var target = nearestActionableAncestor(e.target);
      if (!target) return;

      var href = getHref(target);
      var cls = target.classList || { contains: function() { return false; } };
      var isFoundingCTA =
        cls.contains('founding-cta') ||
        cls.contains('founding-modal-cta') ||
        cls.contains('btn-stripe');
      var isStripeLink = href.indexOf('https://buy.stripe.com/') === 0;
      var isCheckoutLink = /\/checkout\.html(\?|#|$)/.test(href);
      var isBookLink = /\/book\.html(\?|#|$)/.test(href);
      var isMailto = href.indexOf('mailto:') === 0;
      var isTel = href.indexOf('tel:') === 0;
      var isSocial =
        href.indexOf('instagram.com') !== -1 ||
        href.indexOf('linkedin.com') !== -1;

      // Lead fires on any "Claim a Founding Spot" intent click. Per the
      // spec these clicks also count as InitiateCheckout (Stripe URL).
      if (isFoundingCTA || isStripeLink) {
        trackLead();
        trackInitiateCheckout();
      } else if (isCheckoutLink) {
        // Same-tab nav to /checkout.html — Stripe button not clicked yet,
        // but they've entered the checkout flow.
        trackInitiateCheckout();
      } else if (isBookLink || isMailto || isTel || isSocial) {
        trackContact();
      }
    }, /* useCapture */ true);
  }

  // ViewContent: founding modal becoming visible.
  function watchFoundingModal() {
    var modal = document.getElementById('foundingModalOverlay');
    if (!modal || typeof MutationObserver === 'undefined') return;
    var observer = new MutationObserver(function() {
      if (modal.classList.contains('active')) {
        trackViewContent();
      }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
    // Edge case: modal could already be open at script-load time.
    if (modal.classList.contains('active')) trackViewContent();
  }

  // Contact: booking form submission on the homepage modal.
  function bindBookingForm() {
    var form = document.getElementById('bookingForm');
    if (!form) return;
    form.addEventListener('submit', function() {
      trackContact();
    });
  }

  // Contact: Calendly booking confirmation on /book.html — Calendly is
  // an iframe and posts a `calendly.event_scheduled` message to the
  // parent when a booking is confirmed.
  function bindCalendly() {
    window.addEventListener('message', function(e) {
      if (!e || !e.data || typeof e.data !== 'object') return;
      var name = e.data.event;
      if (typeof name !== 'string') return;
      if (name === 'calendly.event_scheduled') {
        trackContact();
      }
    });
  }

  function init() {
    bindClicks();
    watchFoundingModal();
    bindBookingForm();
    bindCalendly();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
