/* Velonyx Demo Chat — reusable "Live AI Lead System" widget for demo sites
 * ============================================================================
 * A floating panel that demos the business's AI assistant. Two modes:
 *
 *   PASSIVE (default): auto-plays a short scripted conversation on a loop, so a
 *     visitor sees the Velonyx AI in miniature. (Used when no `knowledge` given.)
 *
 *   INTERACTIVE (opt-in): plays the script ONCE as a teaser, then lets the
 *     visitor type questions or tap suggested ones and get answers about THAT
 *     business from a built-in knowledge base — no backend. If asked something
 *     off-list it offers to take their number (demo lead capture). Turns on
 *     automatically when `knowledge` (or `ai.apiUrl`) is provided.
 *
 * Per-page config — set BEFORE this script loads:
 *   window.VX_DEMO_CONFIG = {
 *     title, subtitle, accent, accentText, footer,   // branding
 *     turns: [ { who:'customer'|'ai', text, type, pause }, ... ],   // teaser script
 *
 *     // --- interactive (all optional; presence of `knowledge` enables it) ---
 *     greeting: 'Ask about hours, pricing, areas…',   // input placeholder
 *     suggestions: ['Do you offer same-day service?', ...],   // tappable chips
 *     knowledge: [ { keywords:['hours','open',...], synonyms:{...}, a:'answer' }, ... ],
 *     fallback: 'Let me have someone follow up — what\'s your number?',
 *     leadCapture: { confirm:'Got it — we\'ll text you.', phoneNudge:'Or call (xxx)...' },
 *     matchThreshold: 0.34,
 *
 *     // --- upgrade hook (off by default): route free text to a real AI ---
 *     ai: { apiUrl:'', businessId:'gdk', context:'...' }
 *   };
 *
 * Collapsible + dismissible, draggable by the header, honors reduced-motion,
 * responsive. Exposes window.VXDemoChat.open() so a page button can open it.
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

  // ---- interactive config ----
  var KNOWLEDGE = (CFG.knowledge && CFG.knowledge.length) ? CFG.knowledge : [];
  var SUGGESTIONS = CFG.suggestions || [];
  var GREETING = CFG.greeting || 'Ask a question…';
  var FALLBACK = CFG.fallback || "Great question — let me have someone follow up. What's the best number to text you back at?";
  var LEAD = CFG.leadCapture || {};
  var AI = CFG.ai || {};
  var THRESHOLD = (typeof CFG.matchThreshold === 'number') ? CFG.matchThreshold : 0.34;
  var IS_INTERACTIVE = (KNOWLEDGE.length > 0) || !!AI.apiUrl;

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
    + '#vx-demo-widget.is-collapsed .vx-demo-body,#vx-demo-widget.is-collapsed .vx-demo-foot,#vx-demo-widget.is-collapsed .vx-demo-chips,#vx-demo-widget.is-collapsed .vx-demo-input-row{display:none;}'
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
    + '#vx-demo-widget.is-interactive .vx-demo-body{height:220px;overflow-y:auto;mask-image:none;-webkit-mask-image:none;}'
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
    + '.vx-demo-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 8px;}'
    + '.vx-demo-chip{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.16);color:rgba(255,255,255,0.82);font-family:inherit;font-size:0.72rem;line-height:1.2;padding:6px 10px;border-radius:999px;cursor:pointer;transition:border-color 0.15s,color 0.15s;}'
    + '.vx-demo-chip:hover,.vx-demo-chip:focus-visible{border-color:var(--vxa);color:#fff;outline:none;}'
    + '.vx-demo-input-row{display:flex;gap:6px;padding:8px 12px;border-top:1px solid rgba(255,255,255,0.1);}'
    + '.vx-demo-input{flex:1;min-width:0;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.16);border-radius:10px;padding:9px 11px;color:#fff;font-family:inherit;font-size:0.8rem;outline:none;}'
    + '.vx-demo-input:focus{border-color:var(--vxa);}'
    + '.vx-demo-input::placeholder{color:rgba(255,255,255,0.4);}'
    + '.vx-demo-send{flex:none;width:38px;border:none;border-radius:10px;background:var(--vxa);color:var(--vxat);font-size:1rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;}'
    + '.vx-demo-send:disabled{opacity:0.5;cursor:default;}'
    + '.vx-demo-foot{padding:8px 14px 10px;border-top:1px solid rgba(255,255,255,0.1);font-size:0.66rem;color:rgba(255,255,255,0.5);text-align:center;letter-spacing:0.3px;}'
    + '.vx-demo-foot strong{color:var(--vxa);font-weight:700;}'
    + '@media (max-width:560px){#vx-demo-widget{left:12px;right:auto;width:min(82vw,300px);bottom:88px;}'
    + '.vx-demo-body{height:200px;}#vx-demo-widget.is-interactive .vx-demo-body{height:158px;}}';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function rm(node) { if (node && node.parentNode) node.parentNode.removeChild(node); }

  function build() {
    var wrap = el('div'); wrap.id = 'vx-demo-widget';
    wrap.setAttribute('role', 'complementary');
    wrap.setAttribute('aria-label', TITLE + ' — AI assistant');
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
    return { wrap: wrap, body: body, foot: foot, collapseBtn: collapseBtn, closeBtn: closeBtn };
  }

  var widget = build();
  var stopped = false;
  var timer = null;
  var userEngaged = false;   // interactive: visitor has typed/tapped — stop the teaser
  var awaitingPhone = false; // interactive: next message treated as a phone number
  var busy = false;          // interactive: a reply is being shown
  var history = [];          // [{role,content}] — for the optional AI upgrade hook
  var sessionId;
  try {
    sessionId = sessionStorage.getItem('vx-demo-sid');
    if (!sessionId) { sessionId = 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); sessionStorage.setItem('vx-demo-sid', sessionId); }
  } catch (e) { sessionId = 'd' + Date.now().toString(36); }

  function wait(ms) { return new Promise(function (r) { timer = setTimeout(r, ms); }); }
  function scrollBottom() { try { widget.body.scrollTop = widget.body.scrollHeight; } catch (e) {} }
  function cap() { if (IS_INTERACTIVE) return; while (widget.body.children.length > 5) widget.body.removeChild(widget.body.firstChild); }
  function showBubble(turn) { var m = el('div', 'vx-demo-msg ' + turn.who); m.textContent = turn.text; widget.body.appendChild(m); cap(); scrollBottom(); }
  function showTyping(who) { var t = el('div', 'vx-demo-typing ' + who, '<span></span><span></span><span></span>'); widget.body.appendChild(t); cap(); scrollBottom(); return t; }

  /* ---------------- PASSIVE mode: loop the script ---------------- */
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
            rm(dots);
          }
          showBubble(turn);
          await wait(REDUCE_MOTION ? 1200 : turn.pause);
        }
        await wait(REDUCE_MOTION ? 4000 : 2200);
      }
    })();
  }

  /* ---------------- INTERACTIVE mode ---------------- */
  function playTeaserOnce() {
    return (async function () {
      for (var i = 0; i < TURNS.length; i++) {
        if (stopped || userEngaged) return;
        var turn = TURNS[i];
        if (!REDUCE_MOTION) {
          var dots = showTyping(turn.who);
          await wait(turn.type);
          if (stopped || userEngaged) { rm(dots); return; }
          rm(dots);
        }
        showBubble(turn);
        await wait(REDUCE_MOTION ? 900 : turn.pause);
      }
    })();
  }

  // ---- text matching (no dependencies) ----
  var STOP = { a:1,an:1,the:1,is:1,are:1,am:1,do:1,does:1,did:1,you:1,i:1,my:1,me:1,to:1,of:1,for:1,in:1,on:1,it:1,can:1,could:1,would:1,how:1,what:1,whats:1,when:1,where:1,which:1,your:1,we:1,with:1,and:1,or:1,'a':1,please:1,hi:1,hey:1,hello:1 };
  function stem(t) { return t.replace(/(ing|es|s)$/, ''); }
  function tokens(s) {
    s = (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    if (!s) return [];
    var arr = s.split(/\s+/), out = [];
    for (var i = 0; i < arr.length; i++) { var w = arr[i]; if (STOP[w]) continue; if (w.length > 3) w = stem(w); if (w) out.push(w); }
    return out;
  }
  function rawNorm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  function buildKw(e) {
    var map = {}, src = (e.keywords || []).slice();
    if (e.synonyms) { for (var k in e.synonyms) { if (e.synonyms.hasOwnProperty(k)) src = src.concat(e.synonyms[k]); } }
    for (var i = 0; i < src.length; i++) { var ts = tokens(src[i]); for (var j = 0; j < ts.length; j++) map[ts[j]] = 1; }
    return map;
  }
  function kwHas(map, token) {
    if (map[token]) return true;
    if (token.length >= 4) { for (var k in map) { if (map.hasOwnProperty(k) && k.length >= 4 && (k.indexOf(token) === 0 || token.indexOf(k) === 0)) return true; } }
    return false;
  }
  function bestMatch(text) {
    var ut = tokens(text); if (!ut.length) return null;
    var rawn = rawNorm(text), best = null, bestScore = -1, bestOverlap = -1;
    for (var i = 0; i < KNOWLEDGE.length; i++) {
      var e = KNOWLEDGE[i];
      var kw = e._tok || (e._tok = buildKw(e));
      var overlap = 0;
      for (var j = 0; j < ut.length; j++) if (kwHas(kw, ut[j])) overlap++;
      var score = overlap / Math.max(1, ut.length);
      var kws = e.keywords || [];
      for (var p = 0; p < kws.length; p++) { if (kws[p].indexOf(' ') > -1 && rawn.indexOf(rawNorm(kws[p])) > -1) { score += 0.15; break; } }
      if (score > bestScore || (score === bestScore && overlap > bestOverlap)) { bestScore = score; bestOverlap = overlap; best = e; }
    }
    return { entry: best, score: bestScore };
  }

  function setSend(on) { if (widget._send) widget._send.disabled = !on; }
  function pushAI(text) { var m = el('div', 'vx-demo-msg ai'); m.textContent = text; widget.body.appendChild(m); history.push({ role: 'assistant', content: text }); scrollBottom(); }

  function botSay(text) {
    busy = true; setSend(false);
    var dots = REDUCE_MOTION ? null : showTyping('ai');
    var delay = REDUCE_MOTION ? 400 : Math.min(1500, 450 + text.length * 10);
    return wait(delay).then(function () { if (dots) rm(dots); pushAI(text); busy = false; setSend(true); });
  }

  function askLocal(text) {
    var m = bestMatch(text);
    if (m && m.entry && m.score >= THRESHOLD) { botSay(m.entry.a); }
    else { awaitingPhone = true; botSay(FALLBACK); }
  }

  function askApi(text) {
    busy = true; setSend(false);
    var dots = REDUCE_MOTION ? null : showTyping('ai');
    fetch(AI.apiUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionId, message: text, history: history.slice(-20), businessId: AI.businessId || '', context: AI.context || '' })
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (dots) rm(dots); pushAI((d && d.reply) ? d.reply : FALLBACK); busy = false; setSend(true);
    }).catch(function () {
      if (dots) rm(dots); busy = false; setSend(true);
      if (KNOWLEDGE.length) { askLocal(text); } else { awaitingPhone = true; botSay(FALLBACK); }
    });
  }

  function handlePhone(text) {
    awaitingPhone = false;
    var digits = (text.match(/\d/g) || []).length;
    var nudge = LEAD.phoneNudge ? (' ' + LEAD.phoneNudge) : '';
    if (digits >= 7) { botSay((LEAD.confirm || "Got it — someone will reach out shortly. Anything else I can help with?") + nudge); }
    else { botSay("No problem — you can reach us anytime." + nudge); }
  }

  function handleUserText(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    userEngaged = true; if (timer) clearTimeout(timer);
    if (widget._chips) widget._chips.style.display = 'none';
    var u = el('div', 'vx-demo-msg customer'); u.textContent = text; widget.body.appendChild(u); scrollBottom();
    history.push({ role: 'user', content: text });
    if (awaitingPhone) { handlePhone(text); return; }
    if (AI.apiUrl) { askApi(text); } else { askLocal(text); }
  }

  function setupInteractiveUI() {
    widget.wrap.classList.add('is-interactive');
    widget.body.setAttribute('aria-live', 'polite');
    if (SUGGESTIONS.length) {
      var chips = el('div', 'vx-demo-chips');
      for (var i = 0; i < SUGGESTIONS.length; i++) {
        (function (label) {
          var c = el('button', 'vx-demo-chip', ''); c.type = 'button'; c.textContent = label;
          c.addEventListener('click', function () { handleUserText(label); });
          chips.appendChild(c);
        })(SUGGESTIONS[i]);
      }
      widget.wrap.insertBefore(chips, widget.foot);
      widget._chips = chips;
    }
    var row = el('div', 'vx-demo-input-row');
    var input = el('input', 'vx-demo-input'); input.type = 'text';
    input.setAttribute('aria-label', 'Ask the AI a question'); input.placeholder = GREETING;
    var send = el('button', 'vx-demo-send', '&#10148;'); send.type = 'button'; send.setAttribute('aria-label', 'Send');
    row.appendChild(input); row.appendChild(send);
    widget.wrap.insertBefore(row, widget.foot);
    widget._input = input; widget._send = send;
    function submit() { var v = input.value; input.value = ''; handleUserText(v); }
    send.addEventListener('click', submit);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
  }

  /* ---------------- shared ---------------- */
  function pauseOnHidden() {
    if (document.hidden) { stopped = true; if (timer) clearTimeout(timer); }
    else if (stopped && !IS_INTERACTIVE) { stopped = false; runLoop(); }
  }

  function makeDraggable(wrap, handle) {
    if (!handle) return;
    handle.style.cursor = 'grab';
    var sx, sy, sl, st, dragging = false;
    function down(e) {
      if (e.target.closest('button')) return;
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
    widget.closeBtn.addEventListener('click', function () { widget.wrap.style.display = 'none'; });
    widget.collapseBtn.addEventListener('click', function () { widget.wrap.classList.toggle('is-collapsed'); });
    document.addEventListener('visibilitychange', pauseOnHidden);

    if (IS_INTERACTIVE) { setupInteractiveUI(); playTeaserOnce(); }
    else { runLoop(); }

    // Let a page button (e.g. an "Ask the AI" launcher) open the widget.
    window.VXDemoChat = {
      open: function () {
        widget.wrap.style.display = '';
        widget.wrap.classList.remove('is-collapsed');
        widget.wrap.classList.add('is-visible');
        if (widget._input) { try { widget._input.focus(); } catch (e) {} }
      }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
