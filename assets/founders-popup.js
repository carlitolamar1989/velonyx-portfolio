/* Velonyx Founders' Offer pop-up (2026-08-16)
 * One tasteful modal per visitor: Growth or Elite at half price for six months
 * + AI Video included, first 2 clients. Shows once after a short delay, on a
 * deep scroll, or on exit intent; remembered for 7 days when dismissed and 30
 * days when claimed. Never shows on legal/checkout pages, never twice in a
 * session, never if the URL has ?nopop. Force it for review with ?founders.
 *
 * Config (optional, in marketing-config.js):
 *   window.VELONYX_FOUNDERS = { enabled: true, seats: 2, delayMs: 7000 };
 * Turn it off when both seats are gone: set enabled:false (or seats:0).
 */
(function () {
  var cfg = Object.assign({ enabled: true, seats: 2, delayMs: 2000 }, window.VELONYX_FOUNDERS || {});
  if (!cfg.enabled || cfg.seats <= 0) return;
  if (/nopop/.test(location.search)) return;
  if (/\/(terms|msa|sow|dpa|refund-policy|privacy|sms-terms|sms-opt-in|checkout|activate|book|ownership)\.html/.test(location.pathname)) return;
  var KEY = 'velonyx_founders_popup';
  // Preview switch: any URL with ?founders (or #founders) forces the pop-up right now,
  // ignoring earlier dismissals — for Carlos to review it: https://velonyxsystems.com/?founders
  var force = /(\?|&)founders(=|&|$)/.test(location.search) || location.hash === '#founders';
  if (force) { try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY + '_shown'); } catch (e) {} cfg.delayMs = 0; }
  try {
    var until = Number(localStorage.getItem(KEY) || 0);
    if (!force && until && Date.now() < until) return;
    if (!force && sessionStorage.getItem(KEY + '_shown')) return;
  } catch (e) { return; }

  var css = ''
    + '#vx-fo{position:fixed;inset:0;z-index:2500;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(2,4,8,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;transition:opacity .28s ease;}'
    + '#vx-fo.on{opacity:1;}'
    + '#vx-fo .vx-fo-card{position:relative;width:100%;max-width:520px;background:linear-gradient(165deg,rgba(212,175,55,0.14) 0%,rgba(12,12,16,0.98) 55%,rgba(8,8,10,1) 100%);border:1px solid rgba(212,175,55,0.55);border-radius:22px;padding:34px 30px 28px;box-shadow:0 0 0 1px rgba(212,175,55,0.15),0 30px 80px rgba(0,0,0,0.7),0 0 60px rgba(212,175,55,0.14);color:#fff;font-family:"DM Sans",sans-serif;transform:translateY(14px) scale(.98);transition:transform .32s cubic-bezier(.2,.8,.2,1);}'
    + '#vx-fo.on .vx-fo-card{transform:none;}'
    + '#vx-fo .vx-fo-x{position:absolute;top:12px;right:12px;width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.7);font-size:20px;line-height:1;cursor:pointer;}'
    + '#vx-fo .vx-fo-x:hover{color:#fff;border-color:rgba(212,175,55,0.5);}'
    + '#vx-fo .vx-fo-tag{display:inline-block;font-family:"Space Grotesk",sans-serif;font-size:.64rem;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#0C0C0F;background:linear-gradient(135deg,#D4AF37,#F7E17B);padding:6px 12px;border-radius:99px;margin-bottom:16px;}'
    + '#vx-fo h2{font-family:"Space Grotesk",sans-serif;font-size:1.55rem;line-height:1.2;font-weight:800;margin:0 0 10px;color:#fff;}'
    + '#vx-fo h2 span{background:linear-gradient(135deg,#BF953F,#FCF6BA,#B38728,#FBF5B7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}'
    + '#vx-fo p{font-size:.95rem;line-height:1.6;color:rgba(255,255,255,0.78);margin:0 0 14px;}'
    + '#vx-fo .vx-fo-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0 18px;}'
    + '#vx-fo .vx-fo-plan{border:1px solid rgba(212,175,55,0.22);border-radius:14px;padding:12px 14px;background:rgba(255,255,255,0.03);}'
    + '#vx-fo .vx-fo-plan b{display:block;font-family:"Space Grotesk",sans-serif;font-size:.8rem;letter-spacing:1px;text-transform:uppercase;color:#F0D060;margin-bottom:4px;}'
    + '#vx-fo .vx-fo-plan strong{font-family:"Space Grotesk",sans-serif;font-size:1.35rem;color:#fff;}'
    + '#vx-fo .vx-fo-plan s{color:rgba(255,255,255,0.4);font-size:.85rem;margin-left:6px;}'
    + '#vx-fo .vx-fo-plan em{display:block;font-style:normal;font-size:.75rem;color:rgba(255,255,255,0.55);margin-top:2px;}'
    + '#vx-fo .vx-fo-actions{display:flex;gap:10px;flex-wrap:wrap;}'
    + '#vx-fo .vx-fo-cta{flex:1 1 200px;text-align:center;font-family:"Space Grotesk",sans-serif;font-size:.82rem;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;padding:14px 18px;border-radius:12px;background:linear-gradient(135deg,#D4AF37 0%,#F7E17B 35%,#D4AF37 65%,#B8860B 100%);color:#0C0C0F;text-decoration:none;border:0;cursor:pointer;min-height:48px;}'
    + '#vx-fo .vx-fo-cta:hover{filter:brightness(1.06);box-shadow:0 8px 26px rgba(212,175,55,0.35);}'
    + '#vx-fo .vx-fo-alt{flex:1 1 140px;text-align:center;font-family:"Space Grotesk",sans-serif;font-size:.8rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:14px 16px;border-radius:12px;background:transparent;color:rgba(255,255,255,0.8);border:1px solid rgba(255,255,255,0.22);text-decoration:none;cursor:pointer;min-height:48px;}'
    + '#vx-fo .vx-fo-alt:hover{border-color:#D4AF37;color:#F0D060;}'
    + '#vx-fo .vx-fo-fine{font-size:.72rem;color:rgba(255,255,255,0.42);margin:14px 0 0;line-height:1.5;}'
    + '#vx-fo .vx-fo-seats{font-family:"Space Grotesk",sans-serif;font-size:.74rem;letter-spacing:1.4px;text-transform:uppercase;color:#F0D060;margin-bottom:8px;}'
    + '@media(max-width:480px){#vx-fo .vx-fo-card{padding:28px 20px 22px;}#vx-fo h2{font-size:1.3rem;}#vx-fo .vx-fo-grid{grid-template-columns:1fr;}}'
    + '@media(prefers-reduced-motion:reduce){#vx-fo,#vx-fo .vx-fo-card{transition:none;}}';

  var shown = false;
  function remember(days) { try { localStorage.setItem(KEY, String(Date.now() + days * 86400000)); } catch (e) {} }

  function show() {
    if (shown) return;
    if (document.getElementById('vx-form-overlay') && document.getElementById('vx-form-overlay').style.display === 'flex') return; // lead form already open
    shown = true;
    try { sessionStorage.setItem(KEY + '_shown', '1'); } catch (e) {}
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    var seatsWord = cfg.seats === 1 ? '1 seat left' : cfg.seats + ' seats';
    var wrap = document.createElement('div');
    wrap.id = 'vx-fo';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'vx-fo-title');
    wrap.innerHTML = ''
      + '<div class="vx-fo-card">'
      +   '<button type="button" class="vx-fo-x" aria-label="Close">&times;</button>'
      +   '<span class="vx-fo-tag">Founders&rsquo; Offer</span>'
      +   '<div class="vx-fo-seats">Only ' + seatsWord + ' &middot; first clients only</div>'
      +   '<h2 id="vx-fo-title">Half price for six months, <span>AI Video included.</span></h2>'
      +   '<p>Be one of our first two clients: Growth or Elite at <strong>50% off for months 1&ndash;6</strong>, with the $200/mo AI Video add-on <strong>free</strong> the whole time. Then the regular rate &mdash; and after 12 payments the system is yours.</p>'
      +   '<div class="vx-fo-grid">'
      +     '<div class="vx-fo-plan"><b>Growth</b><strong>$114/mo</strong><s>$229</s><em>months 1&ndash;6, then $229 &rarr; $150</em></div>'
      +     '<div class="vx-fo-plan"><b>Elite</b><strong>$249/mo</strong><s>$499</s><em>months 1&ndash;6, then $499 &rarr; $350</em></div>'
      +   '</div>'
      +   '<div class="vx-fo-actions">'
      +     '<a href="#" class="vx-fo-cta" data-vx-form-open data-vx-form-context="Founders offer popup" data-vx-form-greeting="I want to claim a Founders&rsquo; seat.">Claim a Seat</a>'
      +     '<a href="/#pricing" class="vx-fo-alt">See the plans</a>'
      +   '</div>'
      +   '<p class="vx-fo-fine">In return we ask for a case study and a testimonial. Standard 12-month plan; cancel any time online. Two seats total &mdash; when they&rsquo;re gone, this offer ends.</p>'
      + '</div>';
    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('on'); });

    var prevFocus = document.activeElement;
    var xBtn = wrap.querySelector('.vx-fo-x');
    xBtn.focus();
    function close(days) {
      remember(days);
      wrap.classList.remove('on');
      setTimeout(function () { wrap.parentNode && wrap.parentNode.removeChild(wrap); }, 280);
      document.removeEventListener('keydown', onKey);
      try { prevFocus && prevFocus.focus && prevFocus.focus(); } catch (e) {}
    }
    function onKey(e) { if (e.key === 'Escape') close(7); }
    document.addEventListener('keydown', onKey);
    xBtn.addEventListener('click', function () { close(7); });
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(7); });
    wrap.querySelector('.vx-fo-cta').addEventListener('click', function () { close(30); }); // lead form opens via delegated handler
    wrap.querySelector('.vx-fo-alt').addEventListener('click', function () { close(7); });
    if (window.vxTrack) { try { window.vxTrack('ViewContent', { content_name: 'Founders offer popup' }); } catch (e) {} }
  }

  function arm() {
    var timer = setTimeout(show, cfg.delayMs);
    function onScroll() {
      var h = document.documentElement;
      var pct = (window.scrollY || h.scrollTop) / Math.max(1, h.scrollHeight - h.clientHeight);
      if (pct > 0.15) { clearTimeout(timer); show(); cleanup(); }
    }
    function onLeave(e) { if (e.clientY <= 0) { clearTimeout(timer); show(); cleanup(); } }
    function cleanup() { window.removeEventListener('scroll', onScroll); document.removeEventListener('mouseout', onLeave); }
    window.addEventListener('scroll', onScroll, { passive: true });
    if (matchMedia('(pointer:fine)').matches) document.addEventListener('mouseout', onLeave);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arm); else arm();
})();
