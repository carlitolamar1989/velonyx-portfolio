/* Velonyx Marketing Banner
 * Auto-injects a thin top-of-page banner surfacing the core $700/$70 offer
 * with the premium-at-budget framing. Fixed position on all viewports, pushes
 * the existing fixed nav down by --vx-banner-h. Dismissible per-page-load (no
 * persistence — the brief wants it to reappear on next navigation as a real
 * positioning cue, not a one-time popup).
 *
 * Loaded after the page so the banner appears once the layout is mostly settled.
 */
(function() {
  if (typeof document === 'undefined') return;

  var CSS = ''
    + '#vx-urgency-banner{position:fixed;top:0;left:0;right:0;z-index:1100;background:#02040c;border-bottom:1px solid rgba(212,175,55,0.25);font-family:"DM Sans",system-ui,-apple-system,sans-serif;box-shadow:0 2px 12px rgba(0,0,0,0.5);}'
    + '#vx-urgency-banner .vx-urgency-content{max-width:1200px;margin:0 auto;padding:9px 48px 9px 24px;text-align:center;position:relative;}'
    + '#vx-urgency-banner .vx-urgency-text{font-size:0.82rem;color:rgba(255,255,255,0.82);letter-spacing:0.2px;line-height:1.5;}'
    + '#vx-urgency-banner .vx-urgency-text strong{background:linear-gradient(135deg,#BF953F,#F0D060,#BF953F);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:700;}'
    + '#vx-urgency-banner .vx-urgency-dismiss{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:transparent;border:none;color:rgba(255,255,255,0.5);width:36px;height:36px;font-size:1.4rem;line-height:1;cursor:pointer;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:color 0.2s,background 0.2s;font-family:inherit;padding:0;}'
    + '#vx-urgency-banner .vx-urgency-dismiss:hover,#vx-urgency-banner .vx-urgency-dismiss:focus-visible{color:#D4AF37;background:rgba(212,175,55,0.1);outline:none;}'
    + 'body.vx-banner-active nav{top:var(--vx-banner-h,40px) !important;}'
    + 'body.vx-banner-active main,body.vx-banner-active .hero{padding-top:calc(var(--vx-banner-h,40px) + 110px);}'
    + '@media(max-width:768px){'
    + '  #vx-urgency-banner .vx-urgency-content{padding:8px 40px 8px 14px;}'
    + '  #vx-urgency-banner .vx-urgency-text{font-size:0.74rem;line-height:1.4;}'
    + '  body.vx-banner-active main,body.vx-banner-active .hero{padding-top:calc(var(--vx-banner-h,52px) + 100px);}'
    + '}';

  var HTML = '<div class="vx-urgency-content">'
    + '<span class="vx-urgency-text">'
      + '<strong>Premium Platform, Budget Price</strong> &mdash; The Velonyx System: '
      + '<strong>$700 build + $70/month</strong>. Yours forever.'
    + '</span>'
    + '<button type="button" class="vx-urgency-dismiss" aria-label="Dismiss pricing notice">&times;</button>'
  + '</div>';

  function inject() {
    if (document.getElementById('vx-urgency-banner')) return;

    var style = document.createElement('style');
    style.id = 'vx-urgency-banner-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'vx-urgency-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Founding Member Pricing Notice');
    banner.innerHTML = HTML;
    document.body.insertBefore(banner, document.body.firstChild);
    document.body.classList.add('vx-banner-active');

    // Measure actual height once layout settles, expose as CSS variable.
    function measure() {
      var h = banner.offsetHeight || 40;
      document.documentElement.style.setProperty('--vx-banner-h', h + 'px');
    }
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(measure);
    } else {
      measure();
    }
    // Re-measure on viewport change (banner text wraps differently on resize)
    window.addEventListener('resize', measure, { passive: true });

    var dismiss = banner.querySelector('.vx-urgency-dismiss');
    dismiss.addEventListener('click', function() {
      banner.parentNode && banner.parentNode.removeChild(banner);
      document.body.classList.remove('vx-banner-active');
      document.documentElement.style.setProperty('--vx-banner-h', '0px');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
