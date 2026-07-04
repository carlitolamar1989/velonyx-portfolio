/* Velonyx "$0 down" offer pop-up (2026-07-04).
   Shows once after ~6s on the homepage; dismiss = quiet for 14 days.
   CTA opens the lead form (public funnel = book a call; checkout stays private).
   Wording is the compliance-checked "as low as $0 down" claim — do NOT change
   to an absolute "$0" promise, and keep the fine-print line intact. */
(function () {
  'use strict';
  var KEY = 'vx_offer_popup_seen';
  var QUIET_DAYS = 14;
  try {
    var seen = localStorage.getItem(KEY);
    if (seen && Date.now() - Number(seen) < QUIET_DAYS * 864e5) return;
  } catch (e) {}

  var css = '#vx-offer{position:fixed;inset:0;z-index:6000;display:flex;align-items:center;justify-content:center;padding:20px;}'
    + '#vx-offer .vxo-back{position:absolute;inset:0;background:rgba(3,5,16,.72);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);}'
    + '#vx-offer .vxo-card{position:relative;max-width:430px;width:100%;background:linear-gradient(165deg,rgba(18,25,54,.98),rgba(9,13,32,.995));'
    + 'border:1px solid rgba(212,175,55,.45);border-radius:18px;padding:30px 26px 22px;text-align:center;'
    + 'box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 24px 70px rgba(0,0,0,.6),0 0 40px rgba(212,175,55,.1);}'
    + '#vx-offer .vxo-close{position:absolute;top:10px;right:12px;background:none;border:none;color:rgba(255,255,255,.45);font-size:1.5rem;line-height:1;cursor:pointer;padding:6px;min-width:38px;min-height:38px;}'
    + '#vx-offer .vxo-close:hover{color:#fff;}'
    + '#vx-offer .vxo-shield{width:52px;height:auto;margin:0 auto 12px;display:block;filter:drop-shadow(0 6px 18px rgba(212,175,55,.4));}'
    + '#vx-offer h3{font-family:"Space Grotesk",system-ui,sans-serif;font-weight:900;font-size:1.42rem;line-height:1.18;letter-spacing:-.01em;color:#F0EDE8;margin:0 0 10px;}'
    + '#vx-offer h3 .vxo-gold{background:linear-gradient(180deg,#8a6d1f,#D4AF37 38%,#f6e7a9 62%,#B8860B);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;}'
    + '#vx-offer p{font-family:"DM Sans",system-ui,sans-serif;font-size:.9rem;line-height:1.6;color:rgba(255,255,255,.68);margin:0 0 18px;}'
    + '#vx-offer .vxo-cta{display:block;width:100%;font-family:"Space Grotesk",system-ui,sans-serif;font-weight:800;font-size:.85rem;letter-spacing:1.6px;text-transform:uppercase;'
    + 'background:linear-gradient(135deg,#D4AF37,#F7E17B 35%,#D4AF37 65%,#B8860B);color:#14100a;border:none;border-radius:8px;padding:15px 20px;cursor:pointer;'
    + 'box-shadow:0 8px 26px rgba(212,175,55,.4);transition:transform .15s ease;}'
    + '#vx-offer .vxo-cta:hover{transform:translateY(-2px);}'
    + '#vx-offer .vxo-fine{font-size:.64rem;color:rgba(255,255,255,.38);line-height:1.55;margin:12px 0 0;}'
    + '@media(prefers-reduced-motion:no-preference){#vx-offer .vxo-card{animation:vxoIn .45s cubic-bezier(.16,1,.3,1) both;}'
    + '@keyframes vxoIn{from{opacity:0;transform:translateY(26px) scale(.97);}to{opacity:1;transform:none;}}}'
    + '@media(max-width:520px){#vx-offer{align-items:flex-end;padding:0;}#vx-offer .vxo-card{border-radius:18px 18px 0 0;max-width:none;}}';

  function dismiss(el) {
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
    el.remove();
  }

  function show() {
    if (document.getElementById('vx-offer')) return;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var root = document.createElement('div');
    root.id = 'vx-offer';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Special offer');
    root.innerHTML =
      '<div class="vxo-back"></div>'
      + '<div class="vxo-card">'
      + '<button type="button" class="vxo-close" aria-label="Close">&times;</button>'
      + '<img class="vxo-shield" src="/assets/vs-logo-shield-512.webp" alt="" width="52" height="60">'
      + '<h3>Your AI platform. Built now.<br><span class="vxo-gold">As low as $0 down.</span></h3>'
      + '<p>Pay in full today, or finance your build with monthly payments &mdash; qualified buyers pay nothing at checkout, with the first payment about 30 days out. Either way, your first month of care is on us.</p>'
      + '<button type="button" class="vxo-cta">Start My Build</button>'
      + '<p class="vxo-fine">Financing subject to credit check and approval. Down payment may be required. Rates from 0&ndash;36% APR. Payment options vary by amount and provider.</p>'
      + '</div>';
    document.body.appendChild(root);

    root.querySelector('.vxo-back').addEventListener('click', function () { dismiss(root); });
    root.querySelector('.vxo-close').addEventListener('click', function () { dismiss(root); });
    root.querySelector('.vxo-cta').addEventListener('click', function () {
      dismiss(root);
      if (window.openVelonyxLeadForm) { window.openVelonyxLeadForm({ context: 'Zero-down offer pop-up' }); }
      else { location.href = '/book.html'; }
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { dismiss(root); document.removeEventListener('keydown', esc); }
    });
  }

  if (document.readyState === 'complete') { setTimeout(show, 6000); }
  else { window.addEventListener('load', function () { setTimeout(show, 6000); }); }
})();
