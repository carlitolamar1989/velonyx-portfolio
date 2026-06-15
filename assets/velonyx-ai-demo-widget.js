/* Velonyx AI Demo Widget
 * ============================================================================
 * A floating "Live AI Lead System" panel docked bottom-LEFT (the chat launcher
 * sits bottom-right; the two never collide). Auto-plays a short, realistic SMS
 * conversation between a Customer and the Velonyx AI on a ~25s loop, so a
 * visitor scrolling the page sees the product running in miniature.
 *
 * This is a passive demo — not interactive. It's the "show, don't tell" of the
 * AI Lead System pitch.
 *
 * Behavior:
 *   - Auto-injects into the page on DOMContentLoaded.
 *   - Hidden on screens < 1024px (mobile gets the inline SMS thread placeholder
 *     in the Services section instead — keeps small screens uncluttered).
 *   - Honors prefers-reduced-motion: messages appear instantly, no typing dots.
 *   - Pauses the loop when the tab is hidden, resumes on visibility — zero CPU
 *     cost when not on screen.
 *   - Dismissible with X. Stays dismissed for the rest of the session.
 *   - Collapse arrow folds it to just the header strip.
 *
 * Design constraints (premium / Apple-style):
 *   - 320px wide, dark glassy background, gold hairline + soft shadow.
 *   - Type rhythm: 1-3 chars / 40ms (looks like real human typing, not strobe).
 *   - One "thought per bubble" — no walls of text.
 * ============================================================================ */
(function () {
  if (typeof document === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(max-width: 1023.98px)').matches) return;
  if (sessionStorage.getItem('vx-demo-dismissed') === '1') return;

  var REDUCE_MOTION = false;
  try { REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // ── The script. Each turn: who is talking, the message, and how long to
  //    "type" before the bubble appears. Pause is the gap AFTER the bubble.
  var TURNS = [
    { who: 'customer', text: 'Hi - garage door snapped this morning. Can someone come out today?',  type: 1100, pause: 700 },
    { who: 'ai',       text: 'Got it. Sorry about that. What city are you in?',                      type: 900,  pause: 600 },
    { who: 'customer', text: 'Henderson, near Green Valley.',                                        type: 800,  pause: 500 },
    { who: 'ai',       text: 'Perfect - we cover Henderson. Is the door fully stuck or partly open?', type: 1300, pause: 600 },
    { who: 'customer', text: 'Fully stuck. Car is trapped inside.',                                  type: 900,  pause: 600 },
    { who: 'ai',       text: 'On it. Can I send you a same-day window? Need your name + phone.',     type: 1300, pause: 700 },
    { who: 'customer', text: 'Mike Reyes - 702-555-0184. Thanks!',                                   type: 1000, pause: 700 },
    { who: 'ai',       text: 'Booked. Tech arriving 1-3 PM today. Confirmation text on the way.',    type: 1400, pause: 1800 }
  ];

  var CSS = ''
    + '#vx-demo-widget{position:fixed;left:20px;bottom:104px;width:320px;z-index:1050;'
    + 'background:linear-gradient(165deg,#0c0c10 0%,#040508 100%);'
    + 'border:1px solid rgba(212,175,55,0.32);border-radius:16px;'
    + 'box-shadow:0 18px 48px rgba(0,0,0,0.55),0 2px 12px rgba(212,175,55,0.06);'
    + 'font-family:"DM Sans",system-ui,-apple-system,sans-serif;color:#fff;overflow:hidden;'
    + 'transform:translateY(20px);opacity:0;transition:transform 0.5s ease,opacity 0.5s ease;}'
    + '#vx-demo-widget.is-visible{transform:translateY(0);opacity:1;}'
    + '#vx-demo-widget.is-collapsed .vx-demo-body{display:none;}'
    + '#vx-demo-widget.is-collapsed{width:280px;}'
    + '.vx-demo-head{display:flex;align-items:center;gap:10px;padding:12px 14px;'
    + 'border-bottom:1px solid rgba(212,175,55,0.16);background:rgba(212,175,55,0.04);}'
    + '.vx-demo-dot{width:8px;height:8px;border-radius:50%;background:#3ddc84;'
    + 'box-shadow:0 0 0 0 rgba(61,220,132,0.7);animation:vxPulse 2s infinite;}'
    + '@keyframes vxPulse{0%{box-shadow:0 0 0 0 rgba(61,220,132,0.5);}70%{box-shadow:0 0 0 8px rgba(61,220,132,0);}100%{box-shadow:0 0 0 0 rgba(61,220,132,0);}}'
    + '.vx-demo-title{font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:0.82rem;'
    + 'letter-spacing:0.3px;flex:1;color:#fff;}'
    + '.vx-demo-title small{display:block;font-family:"DM Sans",sans-serif;font-weight:500;'
    + 'font-size:0.66rem;color:rgba(255,255,255,0.55);letter-spacing:0.2px;margin-top:1px;}'
    + '.vx-demo-btn{background:transparent;border:none;color:rgba(255,255,255,0.5);'
    + 'width:24px;height:24px;font-size:0.95rem;line-height:1;cursor:pointer;border-radius:6px;'
    + 'display:flex;align-items:center;justify-content:center;transition:color 0.18s,background 0.18s;padding:0;}'
    + '.vx-demo-btn:hover,.vx-demo-btn:focus-visible{color:#D4AF37;background:rgba(212,175,55,0.1);outline:none;}'
    + '.vx-demo-body{padding:12px 14px 16px;display:flex;flex-direction:column;gap:8px;'
    + 'height:280px;overflow:hidden;mask-image:linear-gradient(to bottom,transparent,#000 24px,#000 calc(100% - 4px),transparent);'
    + '-webkit-mask-image:linear-gradient(to bottom,transparent,#000 24px,#000 calc(100% - 4px),transparent);}'
    + '.vx-demo-msg{max-width:78%;padding:8px 11px;border-radius:14px;font-size:0.78rem;line-height:1.4;'
    + 'word-wrap:break-word;animation:vxFadeIn 0.28s ease both;}'
    + '@keyframes vxFadeIn{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:translateY(0);}}'
    + '.vx-demo-msg.customer{align-self:flex-start;background:rgba(255,255,255,0.07);'
    + 'border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.92);border-bottom-left-radius:5px;}'
    + '.vx-demo-msg.ai{align-self:flex-end;background:linear-gradient(135deg,#BF953F 0%,#D4AF37 100%);'
    + 'color:#0a0a0a;font-weight:500;border-bottom-right-radius:5px;}'
    + '.vx-demo-typing{align-self:flex-start;background:rgba(255,255,255,0.07);'
    + 'border:1px solid rgba(255,255,255,0.08);padding:9px 12px;border-radius:14px;border-bottom-left-radius:5px;'
    + 'display:flex;gap:3px;animation:vxFadeIn 0.28s ease both;}'
    + '.vx-demo-typing.ai{align-self:flex-end;background:rgba(212,175,55,0.18);border-color:rgba(212,175,55,0.3);border-bottom-right-radius:5px;border-bottom-left-radius:14px;}'
    + '.vx-demo-typing span{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.5);animation:vxDots 1.2s infinite ease-in-out;}'
    + '.vx-demo-typing.ai span{background:rgba(212,175,55,0.8);}'
    + '.vx-demo-typing span:nth-child(2){animation-delay:0.15s;}'
    + '.vx-demo-typing span:nth-child(3){animation-delay:0.3s;}'
    + '@keyframes vxDots{0%,80%,100%{transform:translateY(0);opacity:0.4;}40%{transform:translateY(-3px);opacity:1;}}'
    + '.vx-demo-foot{padding:10px 14px 12px;border-top:1px solid rgba(212,175,55,0.12);display:flex;flex-direction:column;gap:7px;}'
    + '.vx-demo-btn{width:100%;display:block;border:none;border-radius:9px;padding:10px;font-family:"Space Grotesk",sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.2px;cursor:pointer;transition:transform .15s,box-shadow .15s;}'
    + '.vx-demo-btn:hover{transform:translateY(-1px);}'
    + '.vx-demo-ask{background:linear-gradient(135deg,#3b82f6,#60a5fa);color:#fff;}'
    + '.vx-demo-ask:hover{box-shadow:0 6px 18px rgba(37,99,235,0.45);}'
    + '.vx-demo-book{background:linear-gradient(135deg,#F7E17B,#D4AF37);color:#1a1205;}'
    + '.vx-demo-book:hover{box-shadow:0 6px 18px rgba(212,175,55,0.45);}'
    + '@media (max-width:1023.98px){#vx-demo-widget{display:none !important;}}';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function build() {
    var wrap = el('div'); wrap.id = 'vx-demo-widget';
    wrap.setAttribute('role', 'complementary');
    wrap.setAttribute('aria-label', 'Live AI Lead System — example conversation');

    var head = el('div', 'vx-demo-head');
    head.appendChild(el('span', 'vx-demo-dot'));
    head.appendChild(el('div', 'vx-demo-title',
      'Live AI Lead System<small>example conversation</small>'));
    var collapseBtn = el('button', 'vx-demo-btn', '&#8211;'); // n-dash
    collapseBtn.type = 'button';
    collapseBtn.setAttribute('aria-label', 'Collapse');
    var closeBtn = el('button', 'vx-demo-btn', '&times;');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Dismiss');
    head.appendChild(collapseBtn);
    head.appendChild(closeBtn);

    var body = el('div', 'vx-demo-body');
    var foot = el('div', 'vx-demo-foot');
    foot.innerHTML =
      '<button type="button" class="vx-demo-btn vx-demo-ask">&#128172; Ask a Quick Question</button>'
      + '<button type="button" class="vx-demo-btn vx-demo-book">&#128197; Book a Call</button>';

    wrap.appendChild(head);
    wrap.appendChild(body);
    wrap.appendChild(foot);
    return { wrap: wrap, body: body, collapseBtn: collapseBtn, closeBtn: closeBtn };
  }

  var widget = build();
  var stopped = false;
  var timer = null;
  function wait(ms) {
    return new Promise(function (resolve) { timer = setTimeout(resolve, ms); });
  }

  function showBubble(turn) {
    var msg = el('div', 'vx-demo-msg ' + turn.who);
    msg.textContent = turn.text;
    widget.body.appendChild(msg);
    // Cap to last 5 bubbles so the column never overflows
    while (widget.body.children.length > 5) {
      widget.body.removeChild(widget.body.firstChild);
    }
  }

  function showTyping(who) {
    var t = el('div', 'vx-demo-typing ' + who, '<span></span><span></span><span></span>');
    widget.body.appendChild(t);
    while (widget.body.children.length > 5) {
      widget.body.removeChild(widget.body.firstChild);
    }
    return t;
  }

  function reset() {
    widget.body.innerHTML = '';
  }

  function runLoop() {
    return (async function () {
      while (!stopped) {
        reset();
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
        await wait(REDUCE_MOTION ? 4000 : 2000);
      }
    })();
  }

  function pauseOnHidden() {
    if (document.hidden) {
      stopped = true;
      if (timer) clearTimeout(timer);
    } else if (stopped) {
      stopped = false;
      runLoop();
    }
  }

  function makeDraggable(wrap, handle) {
    if (!handle) return;
    handle.style.cursor = 'grab';
    handle.title = 'Drag to move';
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
    // Slide in after a moment so it doesn't compete with first paint
    setTimeout(function () { widget.wrap.classList.add('is-visible'); }, 700);

    widget.closeBtn.addEventListener('click', function () {
      stopped = true;
      if (timer) clearTimeout(timer);
      widget.wrap.parentNode && widget.wrap.parentNode.removeChild(widget.wrap);
      try { sessionStorage.setItem('vx-demo-dismissed', '1'); } catch (e) {}
    });
    widget.collapseBtn.addEventListener('click', function () {
      widget.wrap.classList.toggle('is-collapsed');
    });
    var askBtn = widget.wrap.querySelector('.vx-demo-ask');
    if (askBtn) askBtn.addEventListener('click', function () {
      if (window.openVelonyxChat) { window.openVelonyxChat(); return; }
      var l = document.getElementById('vx-chatbot-launcher');
      if (l) l.click();
    });
    var bookBtn = widget.wrap.querySelector('.vx-demo-book');
    if (bookBtn) bookBtn.addEventListener('click', function () {
      if (window.openVelonyxLeadForm) window.openVelonyxLeadForm({ context: 'Live AI Lead System widget' });
    });
    document.addEventListener('visibilitychange', pauseOnHidden);
    runLoop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
