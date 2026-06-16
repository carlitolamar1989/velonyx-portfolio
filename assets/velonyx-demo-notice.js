/* Velonyx Demo Notice — tiny toast for demo-only action buttons
 * ============================================================================
 * Any element with `data-vx-demo="message"` shows that message as a small toast
 * instead of navigating — used so a demo's "Call Now" button explains what it
 * would do on a real site rather than dialing a placeholder number.
 *
 *   <a href="#" data-vx-demo="On your live site this calls your real phone.">Call</a>
 *
 * Reusable across every demo site. Also exposes window.vxDemoNotice(msg).
 * Self-contained, no dependencies, guarded so it only binds once per page.
 * ============================================================================ */
(function () {
  if (typeof document === 'undefined' || window.__vxDemoNotice) return;
  window.__vxDemoNotice = true;

  var CSS = '#vx-demo-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(16px);'
    + 'max-width:min(92vw,420px);background:rgba(12,12,16,0.97);color:#fff;'
    + 'border:1px solid rgba(255,255,255,0.18);border-radius:12px;padding:13px 18px;'
    + 'font-family:"DM Sans",system-ui,-apple-system,sans-serif;font-size:0.9rem;line-height:1.45;'
    + 'box-shadow:0 18px 48px rgba(0,0,0,0.5);z-index:100001;opacity:0;pointer-events:none;'
    + 'transition:opacity .25s ease,transform .25s ease;text-align:center;cursor:default;}'
    + '#vx-demo-toast.show{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto;}';

  var toast, hideT;
  function ensure() {
    if (toast) return toast;
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    toast = document.createElement('div'); toast.id = 'vx-demo-toast';
    toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    return toast;
  }
  function show(msg) {
    if (!document.body) return;
    ensure();
    toast.textContent = msg || 'This is a demo.';
    void toast.offsetWidth; // reflow so the transition runs every time
    toast.classList.add('show');
    if (hideT) clearTimeout(hideT);
    hideT = setTimeout(function () { toast.classList.remove('show'); }, 3800);
  }
  window.vxDemoNotice = show;

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var trigger = e.target.closest('[data-vx-demo]');
    if (trigger) { e.preventDefault(); show(trigger.getAttribute('data-vx-demo')); return; }
    if (toast && e.target.closest('#vx-demo-toast')) { toast.classList.remove('show'); } // tap to dismiss
  });
})();
