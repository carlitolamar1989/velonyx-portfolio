/* Velonyx Cookie Consent Banner — CCPA-friendly, GA4 + Meta Pixel gating.
 * Stores choice in localStorage key: velonyx_cookie_consent = "accepted" | "rejected"
 * Works with window.__loadGA4() defined inline in each page's <head>,
 * and window.__loadMetaPixel() defined below (reads VELONYX_MARKETING config).
 */

// Meta Pixel loader — only fires if window.VELONYX_MARKETING.META_PIXEL_ID is set.
// Standard FB pixel base code (https://developers.facebook.com/docs/meta-pixel/get-started).
window.__loadMetaPixel = function(){
  var cfg = window.VELONYX_MARKETING || {};
  var pixelId = cfg.META_PIXEL_ID;
  if (!pixelId || document.querySelector('script[data-meta-pixel]')) return;
  // jshint ignore:start
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;t.setAttribute('data-meta-pixel','1');s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window,document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  // jshint ignore:end
  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
};

// Helper for page-specific events (InitiateCheckout, Lead, etc.).
// Call e.g.: window.vxTrack('Lead', {content_name: 'Calendly booking'});
window.vxTrack = function(eventName, params){
  if (window.fbq) { try { window.fbq('track', eventName, params || {}); } catch(e) {} }
  if (window.gtag) { try { window.gtag('event', eventName, params || {}); } catch(e) {} }
};

// ---------------------------------------------------------------------------
// CCPA/CPRA "Do Not Sell or Share" + Global Privacy Control (GPC).
// The Meta Pixel is cross-context behavioral advertising, which CPRA treats as
// "sharing". A browser sending the GPC signal (navigator.globalPrivacyControl)
// is a legally valid opt-out, so we honor it automatically: no pixel, no GA4,
// no banner nag. window.vxOptOut() is the manual opt-out used by the
// "Do Not Sell or Share My Personal Information" link/button.
// ---------------------------------------------------------------------------
window.vxHasGPC = function(){
  try { return navigator.globalPrivacyControl === true || navigator.globalPrivacyControl === '1'; } catch(e) { return false; }
};
window.vxOptOut = function(){
  try { localStorage.setItem('velonyx_cookie_consent','rejected'); localStorage.setItem('velonyx_do_not_sell','1'); } catch(e) {}
  // Best-effort: expire the pixel/analytics first-party cookies we may have set.
  try {
    var host = location.hostname.replace(/^www\./,'');
    ['_fbp','_fbc','_ga','_gid','_gat'].forEach(function(n){
      document.cookie = n + '=; Max-Age=0; path=/';
      document.cookie = n + '=; Max-Age=0; path=/; domain=.' + host;
    });
    document.cookie.split(';').forEach(function(c){ var n = c.split('=')[0].trim(); if (/^_ga_/.test(n)) { document.cookie = n + '=; Max-Age=0; path=/; domain=.' + host; } });
  } catch(e) {}
  try { if (window.fbq) window.fbq('consent','revoke'); } catch(e) {}
  try { window['ga-disable-' + ((window.VELONYX_MARKETING||{}).GA4_ID || '')] = true; } catch(e) {}
  var b = document.getElementById('vx-cookie-banner'); if (b && b.parentNode) b.parentNode.removeChild(b);
  return true;
};
window.vxIsOptedOut = function(){
  try { return window.vxHasGPC() || localStorage.getItem('velonyx_do_not_sell') === '1' || localStorage.getItem('velonyx_cookie_consent') === 'rejected'; } catch(e) { return false; }
};

// GPC = opt-out. Record it once so the inline GA4 stub and everything else see "rejected".
try {
  if (window.vxHasGPC() && !localStorage.getItem('velonyx_cookie_consent')) {
    localStorage.setItem('velonyx_cookie_consent','rejected');
    localStorage.setItem('velonyx_do_not_sell','gpc');
  }
} catch (e) {}

// If consent was previously granted (and no opt-out signal), load the Meta Pixel right away.
// (The inline GA4 stub already handles GA4 the same way.)
try {
  if (localStorage.getItem('velonyx_cookie_consent') === 'accepted' && !window.vxIsOptedOut()) {
    window.__loadMetaPixel();
  }
} catch (e) {}

// Put a "Do Not Sell or Share My Personal Information" link in every footer,
// right after the Privacy Policy link, so it is one click from any page.
(function(){
  function addLink(){
    if (document.getElementById('vx-do-not-sell')) return;
    var anchors = document.querySelectorAll('footer a[href*="privacy.html"], .footer a[href*="privacy.html"], [class*="footer"] a[href*="privacy.html"]');
    var ref = anchors.length ? anchors[anchors.length - 1] : null;
    if (!ref || !ref.parentNode) return;
    var a = document.createElement('a');
    a.id = 'vx-do-not-sell';
    a.href = '/privacy.html#your-privacy-choices';
    a.textContent = 'Do Not Sell or Share My Personal Information';
    a.className = ref.className;
    if (ref.getAttribute('style')) a.setAttribute('style', ref.getAttribute('style'));
    // Copy the separator pattern if the footer uses text separators (e.g. " · ")
    var sep = ref.nextSibling && ref.nextSibling.nodeType === 3 && /^\s*[·|•\-]\s*$/.test(ref.nextSibling.nodeValue) ? ref.nextSibling.cloneNode() : null;
    if (sep) { ref.parentNode.insertBefore(sep, ref.nextSibling); ref.parentNode.insertBefore(a, sep.nextSibling); }
    else { ref.parentNode.insertBefore(a, ref.nextSibling); if (ref.previousSibling && ref.previousSibling.nodeType === 3 && ref.previousSibling.nodeValue.trim() === '' && ref.previousSibling.nodeValue.length) { ref.parentNode.insertBefore(document.createTextNode(ref.previousSibling.nodeValue), a); } }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addLink); else addLink();
})();

(function(){
  try {
    if (localStorage.getItem('velonyx_cookie_consent')) return; // already decided (incl. GPC)
  } catch(e) { return; }

  var css = ''
    + '#vx-cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:100000;padding:18px 24px;background:rgba(2,4,8,0.97);border-top:1px solid rgba(212,175,55,0.3);backdrop-filter:blur(12px);box-shadow:0 -8px 40px rgba(0,0,0,0.6);font-family:"DM Sans",sans-serif;color:#fff;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:14px;}'
    + '#vx-cookie-banner .vx-cb-text{flex:1 1 420px;font-size:0.87rem;line-height:1.55;color:rgba(255,255,255,0.85);max-width:720px;}'
    + '#vx-cookie-banner .vx-cb-text a{color:#D4AF37;text-decoration:underline;}'
    + '#vx-cookie-banner .vx-cb-actions{display:flex;gap:10px;flex-wrap:wrap;}'
    + '#vx-cookie-banner button{font-family:"Space Grotesk",sans-serif;font-size:0.78rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:12px 22px;border-radius:8px;cursor:pointer;transition:all 0.2s;min-height:44px;min-width:160px;}'
    + '#vx-cookie-banner button:focus-visible{outline:2px solid #D4AF37;outline-offset:2px;}'
    + '#vx-cookie-banner .vx-cb-accept{background:linear-gradient(135deg,#D4AF37,#F7E17B);color:#08080A;border:1px solid #D4AF37;}'
    + '#vx-cookie-banner .vx-cb-accept:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(212,175,55,0.35);}'
    + '#vx-cookie-banner .vx-cb-reject{background:transparent;color:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.35);}'
    + '#vx-cookie-banner .vx-cb-reject:hover{border-color:#D4AF37;color:#D4AF37;}'
    + '@media(max-width:640px){#vx-cookie-banner{padding:14px 16px;}#vx-cookie-banner button{min-width:140px;padding:11px 16px;font-size:0.72rem;}}';

  function inject(){
    if (document.getElementById('vx-cookie-banner')) return;
    var style = document.createElement('style');
    style.id = 'vx-cookie-style';
    style.textContent = css;
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'vx-cookie-banner';
    banner.setAttribute('role','dialog');
    banner.setAttribute('aria-label','Cookie consent');
    banner.innerHTML = ''
      + '<div class="vx-cb-text">We use cookies for site functionality, analytics, and advertising measurement (Google Analytics and the Meta Pixel). You can accept all cookies or reject non-essential cookies. See our <a href="/privacy.html">Privacy Policy</a> for details.</div>'
      + '<div class="vx-cb-actions">'
        + '<button type="button" class="vx-cb-reject" id="vx-cb-reject">Reject Non-Essential</button>'
        + '<button type="button" class="vx-cb-accept" id="vx-cb-accept">Accept Cookies</button>'
      + '</div>';
    document.body.appendChild(banner);

    document.getElementById('vx-cb-accept').addEventListener('click', function(){
      try { localStorage.setItem('velonyx_cookie_consent','accepted'); } catch(e) {}
      if (typeof window.__loadGA4 === 'function') window.__loadGA4();
      if (typeof window.__loadMetaPixel === 'function') window.__loadMetaPixel();
      banner.parentNode && banner.parentNode.removeChild(banner);
    });
    document.getElementById('vx-cb-reject').addEventListener('click', function(){
      try { localStorage.setItem('velonyx_cookie_consent','rejected'); } catch(e) {}
      banner.parentNode && banner.parentNode.removeChild(banner);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
