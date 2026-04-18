/* Velonyx Cookie Consent Banner — CCPA-friendly, GA4-gating.
 * Stores choice in localStorage key: velonyx_cookie_consent = "accepted" | "rejected"
 * Works with window.__loadGA4() defined inline in each page's <head>.
 */
(function(){
  try {
    if (localStorage.getItem('velonyx_cookie_consent')) return; // already decided
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
      + '<div class="vx-cb-text">We use cookies for analytics and site functionality. You can accept all cookies or reject non-essential cookies. See our <a href="/privacy.html">Privacy Policy</a> for details.</div>'
      + '<div class="vx-cb-actions">'
        + '<button type="button" class="vx-cb-reject" id="vx-cb-reject">Reject Non-Essential</button>'
        + '<button type="button" class="vx-cb-accept" id="vx-cb-accept">Accept Cookies</button>'
      + '</div>';
    document.body.appendChild(banner);

    document.getElementById('vx-cb-accept').addEventListener('click', function(){
      try { localStorage.setItem('velonyx_cookie_consent','accepted'); } catch(e) {}
      if (typeof window.__loadGA4 === 'function') window.__loadGA4();
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
