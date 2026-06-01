/* Velonyx Conversational Lead Form
 * ============================================================================
 * Embeddable chat-style modal. Replaces the legacy static booking form.
 *
 * USAGE:
 *   - Direct CTA: any element with [data-vx-form-open] opens the form.
 *     Optional [data-vx-form-context="…"] passes a short context string the
 *     model uses as a starting frame (e.g. "Get Started — Growth tier").
 *   - Programmatic: window.openVelonyxLeadForm({ context: '…', initialMessage: '…' });
 *   - Chatbot handoff: velonyx-chatbot.js calls window.openVelonyxLeadForm()
 *     when the Lambda returns { handoff: true }.
 *
 * SECURITY:
 *   - No API key in the browser. POSTs to the Lambda's /form-turn endpoint
 *     (derived from window.VELONYX_CHATBOT_API_URL by swapping /chat → /form-turn).
 *   - If no API URL is set, the form falls back to a minimal lead-capture
 *     POST to the existing leads endpoint, mirroring the old booking modal.
 * ============================================================================
 */
(function() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('vx-form-root')) return;

  // ── Configurable endpoints ────────────────────────────────────────────────
  var CHATBOT_API_URL = (typeof window !== 'undefined' && window.VELONYX_CHATBOT_API_URL) || null;
  var FORM_API_URL = CHATBOT_API_URL ? CHATBOT_API_URL.replace(/\/chat\b\/?$/, '/form-turn') : null;
  var LEADS_FALLBACK = 'https://jyo775chsk.execute-api.us-east-1.amazonaws.com/leads';

  // ── Shared session id (matches the chatbot widget) ────────────────────────
  var sessionId = sessionStorage.getItem('vx_chat_session_id');
  if (!sessionId) {
    sessionId = 'vx_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
    sessionStorage.setItem('vx_chat_session_id', sessionId);
  }

  // ── Conversation state (per-open) ─────────────────────────────────────────
  var history = []; // [{role:'user'|'assistant', content}]
  var sessionStartMs = 0;
  var turnCount = 0;
  var completed = false;
  var pendingContext = '';

  // ── Inline styles ─────────────────────────────────────────────────────────
  var CSS = ''
    + '#vx-form-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.78);z-index:2000;display:none;align-items:flex-start;justify-content:center;padding:32px 16px;overflow-y:auto;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);}'
    + '#vx-form-overlay.open{display:flex;}'
    + '#vx-form-panel{position:relative;width:100%;max-width:480px;background:#0C0C0F;border:1px solid rgba(212,175,55,0.3);border-radius:18px;box-shadow:0 24px 64px rgba(0,0,0,0.7),0 0 0 1px rgba(212,175,55,0.1);display:flex;flex-direction:column;overflow:hidden;font-family:"DM Sans",system-ui,sans-serif;max-height:calc(100vh - 64px);}'
    + '@media(max-width:520px){#vx-form-overlay{padding:0;align-items:flex-end;}#vx-form-panel{max-width:none;max-height:92vh;border-radius:18px 18px 0 0;}}'
    + '#vx-form-overlay.open #vx-form-panel{animation:vxFormIn 0.28s cubic-bezier(0.2,0.9,0.3,1.1);}'
    + '@keyframes vxFormIn{0%{transform:translateY(20px) scale(0.97);opacity:0;}100%{transform:translateY(0) scale(1);opacity:1;}}'
    + '#vx-form-header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;background:linear-gradient(165deg,rgba(212,175,55,0.1) 0%,rgba(8,8,10,0.95) 100%);border-bottom:1px solid rgba(212,175,55,0.14);}'
    + '#vx-form-header .vx-title{display:flex;align-items:center;gap:10px;font-family:"Space Grotesk",sans-serif;font-size:0.98rem;font-weight:700;color:#F0EDE8;letter-spacing:0.3px;}'
    + '#vx-form-header .vx-title-dot{width:8px;height:8px;border-radius:50%;background:#34D399;box-shadow:0 0 8px rgba(52,211,153,0.6);}'
    + '#vx-form-header .vx-subtitle{font-family:"DM Sans",sans-serif;font-size:0.72rem;color:rgba(240,237,232,0.55);margin-top:3px;letter-spacing:0.2px;}'
    + '#vx-form-header .vx-close{background:transparent;border:none;color:rgba(240,237,232,0.6);width:34px;height:34px;border-radius:8px;cursor:pointer;font-size:1.5rem;line-height:1;display:flex;align-items:center;justify-content:center;transition:color 0.2s,background 0.2s;font-family:inherit;padding:0;}'
    + '#vx-form-header .vx-close:hover{color:#D4AF37;background:rgba(212,175,55,0.08);}'
    + '#vx-form-messages{flex:1;overflow-y:auto;padding:20px 18px;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth;min-height:160px;}'
    + '#vx-form-messages::-webkit-scrollbar{width:6px;}'
    + '#vx-form-messages::-webkit-scrollbar-thumb{background:rgba(212,175,55,0.22);border-radius:3px;}'
    + '.vx-fm{max-width:88%;padding:11px 15px;border-radius:14px;font-size:0.94rem;line-height:1.5;word-wrap:break-word;}'
    + '.vx-fm.vx-fm-user{align-self:flex-end;background:linear-gradient(135deg,rgba(212,175,55,0.2) 0%,rgba(212,175,55,0.08) 100%);border:1px solid rgba(212,175,55,0.3);color:#F0EDE8;border-bottom-right-radius:4px;}'
    + '.vx-fm.vx-fm-bot{align-self:flex-start;background:#17171B;border:1px solid #1E1E22;color:#F0EDE8;border-bottom-left-radius:4px;}'
    + '.vx-fm.vx-fm-error{background:rgba(220,80,80,0.12);border-color:rgba(220,80,80,0.3);}'
    + '.vx-fm.vx-fm-success{background:rgba(52,211,153,0.12);border:1px solid rgba(52,211,153,0.4);color:#F0EDE8;}'
    + '.vx-fm.vx-fm-success::before{content:"✓ ";color:#34D399;font-weight:700;}'
    + '.vx-typing{align-self:flex-start;padding:13px 17px;background:#17171B;border:1px solid #1E1E22;border-radius:14px;border-bottom-left-radius:4px;display:flex;gap:5px;}'
    + '.vx-typing span{width:6px;height:6px;border-radius:50%;background:rgba(212,175,55,0.7);animation:vxDot 1.2s infinite ease-in-out;}'
    + '.vx-typing span:nth-child(2){animation-delay:0.15s;}'
    + '.vx-typing span:nth-child(3){animation-delay:0.3s;}'
    + '@keyframes vxDot{0%,80%,100%{transform:scale(0.6);opacity:0.4;}40%{transform:scale(1);opacity:1;}}'
    + '#vx-form-input-row{display:flex;gap:8px;padding:14px 16px;border-top:1px solid rgba(212,175,55,0.1);background:#08080A;}'
    + '#vx-form-input{flex:1;background:#17171B;border:1px solid rgba(212,175,55,0.18);color:#F0EDE8;padding:12px 14px;border-radius:10px;font-family:"DM Sans",system-ui,sans-serif;font-size:0.95rem;line-height:1.4;outline:none;transition:border-color 0.2s;resize:none;min-height:44px;max-height:90px;}'
    + '#vx-form-input:focus{border-color:rgba(212,175,55,0.5);}'
    + '#vx-form-input::placeholder{color:rgba(240,237,232,0.35);}'
    + '#vx-form-send{background:linear-gradient(135deg,#D4AF37 0%,#F7E17B 35%,#D4AF37 65%,#B8860B 100%);border:none;color:#08080A;width:44px;height:44px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform 0.2s,box-shadow 0.2s;font-family:inherit;padding:0;}'
    + '#vx-form-send:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(212,175,55,0.4);}'
    + '#vx-form-send:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none;}'
    + '#vx-form-send svg{width:18px;height:18px;}'
    + '#vx-form-footnote{padding:9px 16px 13px;font-size:0.68rem;color:rgba(240,237,232,0.42);text-align:center;border-top:1px solid rgba(212,175,55,0.05);background:#08080A;letter-spacing:0.2px;}'
    + '#vx-form-footnote a{color:rgba(212,175,55,0.7);text-decoration:none;}';

  // ── DOM build ──────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.id = 'vx-form-style';
  style.textContent = CSS;
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.id = 'vx-form-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'vx-form-title');
  overlay.innerHTML = ''
    + '<div id="vx-form-panel">'
    + '  <div id="vx-form-header">'
    + '    <div>'
    + '      <div class="vx-title"><span class="vx-title-dot"></span><span id="vx-form-title">Tell Velonyx What You Need</span></div>'
    + '      <div class="vx-subtitle">Quick chat &middot; then we text you back in seconds</div>'
    + '    </div>'
    + '    <button type="button" class="vx-close" aria-label="Close form">&times;</button>'
    + '  </div>'
    + '  <div id="vx-form-messages" aria-live="polite" aria-atomic="false"></div>'
    + '  <div id="vx-form-input-row">'
    + '    <textarea id="vx-form-input" rows="1" placeholder="Type your answer..." aria-label="Your answer"></textarea>'
    + '    <button type="button" id="vx-form-send" aria-label="Send">'
    + '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>'
    + '    </button>'
    + '  </div>'
    + '  <div id="vx-form-footnote">By continuing you consent to be contacted by SMS &amp; email. Reply STOP to opt out. <a href="/privacy.html">Privacy</a></div>'
    + '</div>';

  var root = document.createElement('div');
  root.id = 'vx-form-root';
  root.appendChild(overlay);
  document.body.appendChild(root);

  var messagesEl = overlay.querySelector('#vx-form-messages');
  var inputEl    = overlay.querySelector('#vx-form-input');
  var sendBtn    = overlay.querySelector('#vx-form-send');
  var closeBtn   = overlay.querySelector('.vx-close');

  // ── UI helpers ─────────────────────────────────────────────────────────────
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function appendMessage(role, text, opts) {
    opts = opts || {};
    var div = document.createElement('div');
    div.className = 'vx-fm vx-fm-' + role;
    if (opts.error)   div.classList.add('vx-fm-error');
    if (opts.success) div.classList.add('vx-fm-success');
    div.innerHTML = escapeHTML(text).replace(/\n/g, '<br>');
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    if (role === 'user' || role === 'bot') {
      history.push({ role: role === 'user' ? 'user' : 'assistant', content: text });
    }
  }
  var typingEl = null;
  function showTyping() {
    if (typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'vx-typing';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function hideTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
  }

  // ── Open / close ──────────────────────────────────────────────────────────
  function resetState() {
    history = [];
    turnCount = 0;
    completed = false;
    pendingContext = '';
    messagesEl.innerHTML = '';
    sessionStartMs = Date.now();
  }
  function show() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { inputEl.focus(); }, 200);
  }
  function hide() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  closeBtn.addEventListener('click', hide);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) hide();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) hide();
  });

  // ── Global open API ────────────────────────────────────────────────────────
  window.openVelonyxLeadForm = function(opts) {
    opts = opts || {};
    resetState();
    pendingContext = opts.context || '';
    show();
    var greeting = opts.initialMessage
      || (pendingContext ? "Got it — let's get your details. What's your name?" : "Quick — what's your name?");
    setTimeout(function() {
      showTyping();
      setTimeout(function() {
        hideTyping();
        appendMessage('bot', greeting);
      }, 500);
    }, 200);
  };

  // ── Send handler ──────────────────────────────────────────────────────────
  function sendMessage() {
    if (completed) return;
    var text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    inputEl.style.height = 'auto';
    turnCount++;
    appendMessage('user', text);
    sendBtn.disabled = true;
    if (FORM_API_URL) {
      sendToLambda(text);
    } else {
      sendToFallback(text);
    }
  }
  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  inputEl.addEventListener('input', function() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(90, inputEl.scrollHeight) + 'px';
  });

  // ── AI mode: POST to Lambda /form-turn ────────────────────────────────────
  function sendToLambda(text) {
    showTyping();
    fetch(FORM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId,
        message: text,
        history: history.slice(-20),
        formState: { context: pendingContext },
        chatbot_meta: {
          turns: turnCount,
          session_duration_ms: Date.now() - sessionStartMs,
          source: 'form'
        }
      })
    })
    .then(function(r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    })
    .then(function(data) {
      hideTyping();
      var reply = (data && data.reply) || "Got it — what's the best phone number?";
      appendMessage('bot', reply);
      if (data && data.completed) {
        completed = true;
        var confirm = document.createElement('div');
        confirm.className = 'vx-fm vx-fm-bot vx-fm-success';
        confirm.textContent = "Texting you now — answer right back.";
        messagesEl.appendChild(confirm);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        firePixelLead();
        inputEl.placeholder = "Conversation continues over SMS";
        sendBtn.disabled = true;
      } else {
        sendBtn.disabled = false;
      }
    })
    .catch(function(err) {
      hideTyping();
      console.warn('form-turn failed:', err);
      appendMessage('bot', "I'm having trouble — drop your phone number and we'll text you within 60 seconds.", { error: true });
      sendBtn.disabled = false;
    });
  }

  // ── Fallback: minimal 3-question flow → legacy leads endpoint ─────────────
  // Used when window.VELONYX_CHATBOT_API_URL is not set (e.g. Lambda not yet
  // deployed). Mirrors the old booking modal's contract so leads keep landing.
  var FALLBACK_STATE = { step: 0, name: '', phone: '', interest: '' };
  function sendToFallback(text) {
    showTyping();
    setTimeout(function() {
      hideTyping();
      var reply = '';
      if (FALLBACK_STATE.step === 0) {
        FALLBACK_STATE.name = text;
        reply = "Thanks " + text.split(/\s+/)[0] + ". What's the best phone number for a quick text back?";
        FALLBACK_STATE.step = 1;
      } else if (FALLBACK_STATE.step === 1) {
        var digits = text.replace(/\D/g, '');
        if (digits.length < 10) {
          reply = "That doesn't look complete — try again with all 10 digits?";
        } else {
          FALLBACK_STATE.phone = digits.length === 11 && digits[0] === '1' ? '+' + digits : '+1' + digits;
          reply = "Got it. Last one — what do you need (website, lead system, voice agent, video)?";
          FALLBACK_STATE.step = 2;
        }
      } else if (FALLBACK_STATE.step === 2) {
        FALLBACK_STATE.interest = text;
        submitFallbackLead();
        reply = "Got it. Carlos will reach out within 1 hour at " + FALLBACK_STATE.phone + ".";
        completed = true;
        firePixelLead();
        inputEl.placeholder = "Carlos will follow up directly";
      }
      appendMessage('bot', reply, { success: completed });
      sendBtn.disabled = completed;
    }, 600 + Math.random() * 300);
  }
  function submitFallbackLead() {
    var nameParts = (FALLBACK_STATE.name || '').trim().split(/\s+/);
    var payload = {
      firstName: nameParts[0] || 'Form',
      lastName:  nameParts.slice(1).join(' ') || 'Lead',
      phone:     FALLBACK_STATE.phone,
      email:     '',
      service:   FALLBACK_STATE.interest || 'General inquiry (via form)',
      description: 'Lead form fallback submission. Session: ' + sessionId,
      source:    'form-fallback'
    };
    try {
      fetch(LEADS_FALLBACK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function() {});
    } catch (e) {}
  }

  // ── Meta Pixel ─────────────────────────────────────────────────────────────
  function firePixelLead() {
    try {
      if (window.velonyx && typeof window.velonyx.trackLead === 'function') window.velonyx.trackLead();
    } catch (e) {}
  }

  // ── Wire up [data-vx-form-open] CTAs ──────────────────────────────────────
  // Delegated listener so dynamically-added buttons work too.
  document.addEventListener('click', function(e) {
    var t = e.target;
    while (t && t !== document.body) {
      if (t.getAttribute && t.getAttribute('data-vx-form-open') !== null) {
        e.preventDefault();
        var ctx = t.getAttribute('data-vx-form-context') || '';
        var msg = t.getAttribute('data-vx-form-greeting') || '';
        window.openVelonyxLeadForm({ context: ctx, initialMessage: msg });
        return;
      }
      t = t.parentElement;
    }
  }, false);
})();
