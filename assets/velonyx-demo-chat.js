/* Velonyx Demo Chat — reusable "Live AI Lead System" widget for demo sites
 * ============================================================================
 * A floating panel that auto-plays a short, realistic conversation between a
 * Customer and the business's AI assistant, so a visitor to a demo site sees
 * the Velonyx AI lead system running in miniature. Passive demo (not interactive).
 *
 * Per-page config — set BEFORE this script loads:
 *   window.VX_DEMO_CONFIG = {
 *     title:    'Live AI Assistant',          // header line
 *     subtitle: 'example conversation',        // small header line
 *     accent:   '#D4AF37',                     // AI bubble / accent color
 *     accentText: '#0a0a0a',                   // text color on the accent bubble
 *     footer:   'Powered by Velonyx AI',       // footer note
 *     turns: [ { who:'customer'|'ai', text:'...', type:1000, pause:600 }, ... ]
 *   };
 *
 * Behavior: auto-injects on load, loops the script, pauses when tab hidden,
 * collapsible + dismissible (per session), honors prefers-reduced-motion.
 * Responsive: full panel on desktop, compact bottom strip on phones.
 * ============================================================================ */
(function () {
  if (typeof document === 'undefined') return;

  var CFG = window.VX_DEMO_CONFIG || {};
  var ACCENT = CFG.accent || '#D4AF37';
  var ACCENT_TEXT = CFG.accentText || '#0a0a0a';
  var TITLE = CFG.title || 'Live AI Assistant';
  var SUBTITLE = CFG.subtitle || 'example conversation';
  var FOOTER = CFG.footer || 'Powered by <strong>Velonyx AI</strong>';
  var TURNS = (CFG.turns && CFG.turns.length) ? CFG.turns : [
    { who: 'customer', text: 'Hi — do you have any availability this week?', type: 1000, pause: 600 },
    { who: 'ai',       text: 'We do! What day works best for you?',          type: 900,  pause: 600 },
    { who: 'customer', text: 'Thursday afternoon if possible.',              type: 900,  pause: 500 },
    { who: 'ai',       text: 'Perfect. Can I grab your name and number to lock it in?', type: 1200, pause: 700 },
    { who: 'customer', text: 'Sure — Jordan, 555-0142.',                     type: 900,  pause: 600 },
    { who: 'ai',       text: 'Booked for Thursday 2 PM. Confirmation text on the way!', type: 1300, pause: 1800 }
  ];

  var REDUCE_MOTION = false;
  try { REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var CSS = ''
    + '#vx-demo-widget{position:fixed;left:20px;bottom:20px;width:320px;z-index:1050;'
    + '--vxa:' + ACCENT + ';--vxat:' + ACCENT_TEXT + ';'
    + 'background:linear-gradient(165deg,#0c0c10 0%,#040508 100%);'
    + 'border:1px solid rgba(255,255,255,0.14);border-radius:16px;'
    + 'box-shadow:0 18px 48px rgba(0,0,0,0.55);'
    + 'font-family:"DM Sans",system-ui,-apple-system,sans-serif;color:#fff;overflow:hidden;'
    + 'transform:translateY(20px);opacity:0;transition:transform 0.5s ease,opacity 0.5s ease;}'
    + '#vx-demo-widget.is-visible{transform:translateY(0);opacity:1;}'
    + '#vx-demo-widget.is-collapsed .vx-demo-body,#vx-demo-widget.is-collapsed .vx-demo-foot{display:none;}'
    + '.vx-demo-head{display:flex;align-items:center;gap:10px;padding:12px 14px;'
    + 'border-bottom:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);}'
    + '.vx-demo-dot{width:8px;height:8px;border-radius:50%;background:#3ddc84;flex:none;'
    + 'animation:vxPulse 2s infinite;}'
    + '@keyframes vxPulse{0%{box-shadow:0 0 0 0 rgba(61,220,132,0.5);}70%{box-shadow:0 0 0 8px rgba(61,220,132,0);}100%{box-shadow:0 0 0 0 rgba(61,220,132,0);}}'
    + '.vx-demo-title{font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.3px;flex:1;color:#fff;}'
    + '.vx-demo-title small{display:block;font-family:"DM Sans",sans-serif;font-weight:500;font-size:0.66rem;color:rgba(255,255,255,0.55);margin-top:1px;}'
    + '.vx-demo-btn{background:transparent;border:none;color:rgba(255,255,255,0.5);width:24px;height:24px;font-size:0.95rem;line-height:1;cursor:pointer;border-radius:6px;display:flex;align-items:center;justify-content:center;transition:color 0.18s,background 0.18s;padding:0;}'
    + '.vx-demo-btn:hover,.vx-demo-btn:focus-visible{color:var(--vxa);background:rgba(255,255,255,0.08);outline:none;}'
    + '.vx-demo-body{padding:12px 14px 14px;display:flex;flex-direction:column;gap:8px;height:262px;overflow:hidden;'
    + 'mask-image:linear-gradient(to bottom,transparent,#000 24px,#000 calc(100% - 4px),transparent);'
    + '-webkit-mask-image:linear-gradient(to bottom,transparent,#000 24px,#000 calc(100% - 4px),transparent);}'
    + '.vx-demo-msg{max-width:80%;padding:8px 11px;border-radius:14px;font-size:0.78rem;line-height:1.4;word-wrap:break-word;animation:vxFadeIn 0.28s ease both;}'
    + '@keyframes vxFadeIn{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:translateY(0);}}'
    + '.vx-demo-msg.customer{align-self:flex-start;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.09);color:rgba(255,255,255,0.92);border-bottom-left-radius:5px;}'
    + '.vx-demo-msg.ai{align-self:flex-end;background:var(--vxa);color:var(--vxat);font-weight:500;border-bottom-right-radius:5px;}'
    + '.vx-demo-typing{align-self:flex-start;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.09);padding:9px 12px;border-radius:14px;border-bottom-left-radius:5px;display:flex;gap:3px;animation:vxFadeIn 0.28s ease both;}'
    + '.vx-demo-typing.ai{align-self:flex-end;background:rgba(255,255,255,0.14);border-bottom-right-radius:5px;border-bottom-left-radius:14px;}'
    + '.vx-demo-typing span{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.55);animation:vxDots 1.2s infinite ease-in-out;}'
    + '.vx-demo-typing span:nth-child(2){animation-delay:0.15s;}'
    + '.vx-demo-typing span:nth-child(3){animation-delay:0.3s;}'
    + '@keyframes vxDots{0%,80%,100%{transform:translateY(0);opacity:0.4;}40%{transform:translateY(-3px);opacity:1;}}'
    + '.vx-demo-foot{padding:8px 14px 10px;border-top:1px solid rgba(255,255,255,0.1);font-size:0.66rem;color:rgba(255,255,255,0.5);text-align:center;letter-spacing:0.3px;}'
    + '.vx-demo-foot strong{color:var(--vxa);font-weight:700;}'
    + '@media (max-width:560px){#vx-demo-widget{left:12px;right:auto;width:min(82vw,300px);bottom:88px;}'
    + '.vx-demo-body{height:200px;}}';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function build() {
    var wrap = el('div'); wrap.id = 'vx-demo-widget';
    wrap.setAttribute('role', 'complementary');
    wrap.setAttribute('aria-label', TITLE + ' — example conversation');
    var head = el('div', 'vx-demo-head');
    head.appendChild(el('span', 'vx-demo-dot'));
    head.appendChild(el('div', 'vx-demo-title', TITLE + '<small>' + SUBTITLE + '</small>'));
    var collapseBtn = el('button', 'vx-demo-btn', '&#8211;');
    collapseBtn.type = 'button'; collapseBtn.setAttribute('aria-label', 'Collapse');
    var closeBtn = el('button', 'vx-demo-btn', '&times;');
    closeBtn.type = 'button'; closeBtn.setAttribute('aria-label', 'Dismiss');
    head.appendChild(collapseBtn); head.appendChild(closeBtn);
    var body = el('div', 'vx-demo-body');
    var foot = el('div', 'vx-demo-foot', FOOTER + ' &middot; This is the product.');
    wrap.appendChild(head); wrap.appendChild(body); wrap.appendChild(foot);
    return { wrap: wrap, body: body, collapseBtn: collapseBtn, closeBtn: closeBtn };
  }

  var widget = build();
  var stopped = false;
  var timer = null;
  function wait(ms) { return new Promise(function (r) { timer = setTimeout(r, ms); }); }

  function cap() { while (widget.body.children.length > 5) widget.body.removeChild(widget.body.firstChild); }
  function showBubble(turn) { var m = el('div', 'vx-demo-msg ' + turn.who); m.textContent = turn.text; widget.body.appendChild(m); cap(); }
  function showTyping(who) { var t = el('div', 'vx-demo-typing ' + who, '<span></span><span></span><span></span>'); widget.body.appendChild(t); cap(); return t; }

  function runLoop() {
    return (async function () {
      while (!stopped) {
        widget.body.innerHTML = '';
        for (var i = 0; i < TURNS.length; i++) {
          if (stopped) return;
          var turn = TURNS[i];
          if (!REDUCE_MOTION) {
            var dots = showTyping(turn.who);
            await wait(turn.type);
            if (stopped) return;
            dots.parentNode && dots.parentNode.removeChild(dots);
          }
          showBubble(turn);
          await wait(REDUCE_MOTION ? 1200 : turn.pause);
        }
        await wait(REDUCE_MOTION ? 4000 : 2200);
      }
    })();
  }

  function pauseOnHidden() {
    if (document.hidden) { stopped = true; if (timer) clearTimeout(timer); }
    else if (stopped) { stopped = false; runLoop(); }
  }

  function makeDraggable(wrap, handle) {
    if (!handle) return;
    handle.style.cursor = 'grab';
    var sx, sy, sl, st, dragging = false;
    function down(e) {
      if (e.target.closest('button')) return; // don't drag when tapping the buttons
      dragging = true; handle.style.cursor = 'grabbing';
      var p = e.touches ? e.touches[0] : e, r = wrap.getBoundingClientRect();
      wrap.style.top = r.top + 'px'; wrap.style.left = r.left + 'px';
      wrap.style.right = 'auto'; wrap.style.bottom = 'auto';
      sx = p.clientX; sy = p.clientY; sl = r.left; st = r.top;
      e.preventDefault();
    }
    function move(e) {
      if (!dragging) return;
      var p = e.touches ? e.touches[0] : e;
      var nl = sl + (p.clientX - sx), nt = st + (p.clientY - sy);
      nl = Math.max(6, Math.min(nl, window.innerWidth - wrap.offsetWidth - 6));
      nt = Math.max(6, Math.min(nt, window.innerHeight - wrap.offsetHeight - 6));
      wrap.style.left = nl + 'px'; wrap.style.top = nt + 'px';
    }
    function up() { dragging = false; handle.style.cursor = 'grab'; }
    handle.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    handle.addEventListener('touchstart', down, { passive: false });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
  }

  function init() {
    if (document.getElementById('vx-demo-widget')) return;
    var style = document.createElement('style');
    style.id = 'vx-demo-widget-style';
    style.textContent = CSS;
    document.head.appendChild(style);
    document.body.appendChild(widget.wrap);
    makeDraggable(widget.wrap, widget.wrap.querySelector('.vx-demo-head'));
    setTimeout(function () { widget.wrap.classList.add('is-visible'); }, 700);
    widget.closeBtn.addEventListener('click', function () {
      widget.wrap.style.display = 'none'; // hide (not remove) so a button can re-open it
    });
    widget.collapseBtn.addEventListener('click', function () { widget.wrap.classList.toggle('is-collapsed'); });
    document.addEventListener('visibilitychange', pauseOnHidden);
    runLoop();

    // Let a page button (e.g. a "Chat Bot" launcher) re-open the widget.
    window.VXDemoChat = {
      open: function () {
        widget.wrap.style.display = '';
        widget.wrap.classList.remove('is-collapsed');
        widget.wrap.classList.add('is-visible');
      }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
