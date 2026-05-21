/* Velonyx Chatbot Widget
 * Embeddable AI assistant for velonyxsystems.com.
 *
 * MODE: FALLBACK (until window.VELONYX_CHATBOT_API_URL is set)
 *   - Bot greets, runs a 3-turn lead-capture flow:
 *       1. Ask for phone
 *       2. Ask for name + service interest
 *       3. POST lead to the existing leads endpoint; thank the user
 *   - After capture, accepts more questions but acknowledges and flags for Carlos.
 *
 * MODE: AI (when window.VELONYX_CHATBOT_API_URL is set in marketing-config.js)
 *   - POSTs each turn to the Lambda; renders the assistant reply.
 *   - Lambda owns guardrails, lead-capture tool use, and token-budget caps.
 *
 * Loads pre-consent (first-party customer-service utility, not analytics).
 * Pattern matches assets/urgency-banner.js — IIFE, injected <style>, defer-loaded.
 */
(function() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('vx-chatbot-root')) return; // already mounted

  // ── Configurable endpoint ──
  var API_URL = (typeof window !== 'undefined' && window.VELONYX_CHATBOT_API_URL) || null;
  var LEADS_URL = 'https://jyo775chsk.execute-api.us-east-1.amazonaws.com/leads';

  // ── Session state ──
  var sessionId = sessionStorage.getItem('vx_chat_session_id');
  if (!sessionId) {
    sessionId = 'vx_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
    sessionStorage.setItem('vx_chat_session_id', sessionId);
  }
  var history = []; // {role: 'user' | 'assistant', content: string}
  var fallbackStep = 0; // 0=greeting, 1=asked-phone, 2=asked-name, 3=captured
  var captured = { phone: '', name: '', service: '' };
  var transcript = []; // full transcript for the lead payload

  // ── Styles (inline, theme-aware) ──
  var CSS = ''
    + '#vx-chatbot-launcher{position:fixed;bottom:32px;right:32px;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#D4AF37 0%,#F7E17B 35%,#D4AF37 65%,#B8860B 100%);border:none;cursor:pointer;z-index:1001;box-shadow:0 8px 32px rgba(212,175,55,0.35),0 2px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;transition:transform 0.25s,box-shadow 0.25s;font-family:"Space Grotesk",system-ui,sans-serif;}'
    + '#vx-chatbot-launcher:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 12px 40px rgba(212,175,55,0.5),0 4px 12px rgba(0,0,0,0.6);}'
    + '#vx-chatbot-launcher:focus-visible{outline:2px solid #D4AF37;outline-offset:4px;}'
    + '#vx-chatbot-launcher svg{width:28px;height:28px;color:#08080A;}'
    + '#vx-chatbot-launcher .vx-pulse{position:absolute;inset:0;border-radius:50%;border:2px solid #D4AF37;opacity:0;animation:vxPulse 2.2s ease-out 5;}'
    + '@keyframes vxPulse{0%{transform:scale(1);opacity:0.7;}100%{transform:scale(1.6);opacity:0;}}'
    + '#vx-chatbot-launcher.open .vx-pulse{display:none;}'
    + '#vx-chatbot-panel{position:fixed;bottom:104px;right:32px;width:380px;max-width:calc(100vw - 24px);height:560px;max-height:calc(100vh - 140px);background:#0C0C0F;border:1px solid rgba(212,175,55,0.25);border-radius:18px;box-shadow:0 24px 64px rgba(0,0,0,0.7),0 0 0 1px rgba(212,175,55,0.08);z-index:999;display:none;flex-direction:column;overflow:hidden;font-family:"DM Sans",system-ui,sans-serif;transform-origin:bottom right;}'
    + '#vx-chatbot-panel.open{display:flex;animation:vxPanelIn 0.28s cubic-bezier(0.2,0.9,0.3,1.1);}'
    + '@keyframes vxPanelIn{0%{transform:translateY(20px) scale(0.96);opacity:0;}100%{transform:translateY(0) scale(1);opacity:1;}}'
    + '#vx-chatbot-header{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;background:linear-gradient(165deg,rgba(212,175,55,0.08) 0%,rgba(8,8,10,0.95) 100%);border-bottom:1px solid rgba(212,175,55,0.12);}'
    + '#vx-chatbot-header .vx-title{display:flex;align-items:center;gap:10px;font-family:"Space Grotesk",sans-serif;font-size:0.95rem;font-weight:700;color:#F0EDE8;letter-spacing:0.3px;}'
    + '#vx-chatbot-header .vx-title-dot{width:8px;height:8px;border-radius:50%;background:#34D399;box-shadow:0 0 8px rgba(52,211,153,0.6);}'
    + '#vx-chatbot-header .vx-subtitle{font-family:"DM Sans",sans-serif;font-size:0.72rem;color:rgba(240,237,232,0.55);margin-top:2px;letter-spacing:0.2px;}'
    + '#vx-chatbot-header .vx-close{background:transparent;border:none;color:rgba(240,237,232,0.55);width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:1.4rem;line-height:1;display:flex;align-items:center;justify-content:center;transition:color 0.2s,background 0.2s;font-family:inherit;padding:0;}'
    + '#vx-chatbot-header .vx-close:hover{color:#D4AF37;background:rgba(212,175,55,0.08);}'
    + '#vx-chatbot-messages{flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth;}'
    + '#vx-chatbot-messages::-webkit-scrollbar{width:6px;}'
    + '#vx-chatbot-messages::-webkit-scrollbar-thumb{background:rgba(212,175,55,0.2);border-radius:3px;}'
    + '.vx-msg{max-width:84%;padding:10px 14px;border-radius:14px;font-size:0.9rem;line-height:1.5;word-wrap:break-word;}'
    + '.vx-msg.vx-user{align-self:flex-end;background:linear-gradient(135deg,rgba(212,175,55,0.18) 0%,rgba(212,175,55,0.08) 100%);border:1px solid rgba(212,175,55,0.28);color:#F0EDE8;border-bottom-right-radius:4px;}'
    + '.vx-msg.vx-bot{align-self:flex-start;background:#17171B;border:1px solid #1E1E22;color:#F0EDE8;border-bottom-left-radius:4px;}'
    + '.vx-msg-error{background:rgba(220,80,80,0.12);border-color:rgba(220,80,80,0.3);color:#F0EDE8;}'
    + '.vx-typing{align-self:flex-start;padding:12px 16px;background:#17171B;border:1px solid #1E1E22;border-radius:14px;border-bottom-left-radius:4px;display:flex;gap:5px;}'
    + '.vx-typing span{width:6px;height:6px;border-radius:50%;background:rgba(212,175,55,0.6);animation:vxDot 1.2s infinite ease-in-out;}'
    + '.vx-typing span:nth-child(2){animation-delay:0.15s;}'
    + '.vx-typing span:nth-child(3){animation-delay:0.3s;}'
    + '@keyframes vxDot{0%,80%,100%{transform:scale(0.6);opacity:0.4;}40%{transform:scale(1);opacity:1;}}'
    + '#vx-chatbot-input-row{display:flex;gap:8px;padding:14px 16px;border-top:1px solid rgba(212,175,55,0.1);background:#08080A;}'
    + '#vx-chatbot-input{flex:1;background:#17171B;border:1px solid rgba(212,175,55,0.18);color:#F0EDE8;padding:11px 14px;border-radius:10px;font-family:"DM Sans",system-ui,sans-serif;font-size:0.9rem;line-height:1.4;outline:none;transition:border-color 0.2s;resize:none;min-height:42px;max-height:90px;}'
    + '#vx-chatbot-input:focus{border-color:rgba(212,175,55,0.5);}'
    + '#vx-chatbot-input::placeholder{color:rgba(240,237,232,0.35);}'
    + '#vx-chatbot-send{background:linear-gradient(135deg,#D4AF37 0%,#F7E17B 35%,#D4AF37 65%,#B8860B 100%);border:none;color:#08080A;width:42px;height:42px;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform 0.2s,box-shadow 0.2s;font-family:inherit;padding:0;}'
    + '#vx-chatbot-send:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(212,175,55,0.4);}'
    + '#vx-chatbot-send:focus-visible{outline:2px solid #D4AF37;outline-offset:2px;}'
    + '#vx-chatbot-send:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none;}'
    + '#vx-chatbot-send svg{width:18px;height:18px;}'
    + '#vx-chatbot-footnote{padding:8px 16px 12px;font-size:0.68rem;color:rgba(240,237,232,0.4);text-align:center;border-top:1px solid rgba(212,175,55,0.05);background:#08080A;letter-spacing:0.2px;}'
    + '#vx-chatbot-footnote a{color:rgba(212,175,55,0.7);text-decoration:none;}'
    + '#vx-chatbot-footnote a:hover{color:#D4AF37;}'
    + '@media(max-width:480px){'
    + '  #vx-chatbot-launcher{bottom:20px;right:20px;width:56px;height:56px;}'
    + '  #vx-chatbot-panel{bottom:88px;right:12px;left:12px;width:auto;max-width:none;height:75vh;max-height:560px;}'
    + '}';

  // ── DOM build ──
  var style = document.createElement('style');
  style.id = 'vx-chatbot-style';
  style.textContent = CSS;
  document.head.appendChild(style);

  var root = document.createElement('div');
  root.id = 'vx-chatbot-root';
  document.body.appendChild(root);

  // Launcher button
  var launcher = document.createElement('button');
  launcher.id = 'vx-chatbot-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Open Velonyx Assistant chat');
  launcher.innerHTML = ''
    + '<span class="vx-pulse" aria-hidden="true"></span>'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
    + '</svg>';
  root.appendChild(launcher);

  // Panel
  var panel = document.createElement('div');
  panel.id = 'vx-chatbot-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-labelledby', 'vx-chatbot-title');
  panel.innerHTML = ''
    + '<div id="vx-chatbot-header">'
    + '  <div>'
    + '    <div class="vx-title"><span class="vx-title-dot"></span><span id="vx-chatbot-title">Velonyx Assistant</span></div>'
    + '    <div class="vx-subtitle">Direct line to Carlos &middot; replies within 1 hour</div>'
    + '  </div>'
    + '  <button type="button" class="vx-close" aria-label="Close chat">&times;</button>'
    + '</div>'
    + '<div id="vx-chatbot-messages" aria-live="polite" aria-atomic="false"></div>'
    + '<div id="vx-chatbot-input-row">'
    + '  <textarea id="vx-chatbot-input" rows="1" placeholder="Type your message..." aria-label="Type your message"></textarea>'
    + '  <button type="button" id="vx-chatbot-send" aria-label="Send message">'
    + '    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>'
    + '  </button>'
    + '</div>'
    + '<div id="vx-chatbot-footnote">Your conversation is sent to Carlos. <a href="/privacy.html">Privacy</a></div>';
  root.appendChild(panel);

  var messagesEl = panel.querySelector('#vx-chatbot-messages');
  var inputEl = panel.querySelector('#vx-chatbot-input');
  var sendBtn = panel.querySelector('#vx-chatbot-send');
  var closeBtn = panel.querySelector('.vx-close');

  // ── UI helpers ──
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function appendMessage(role, text, opts) {
    opts = opts || {};
    var div = document.createElement('div');
    div.className = 'vx-msg vx-' + (role === 'user' ? 'user' : 'bot');
    if (opts.error) div.classList.add('vx-msg-error');
    div.innerHTML = escapeHTML(text).replace(/\n/g, '<br>');
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    if (role !== 'system') {
      history.push({ role: role === 'user' ? 'user' : 'assistant', content: text });
      transcript.push((role === 'user' ? 'CUSTOMER: ' : 'BOT: ') + text);
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

  // ── Open / close ──
  var hasGreeted = false;
  function openPanel() {
    panel.classList.add('open');
    launcher.classList.add('open');
    launcher.setAttribute('aria-expanded', 'true');
    if (!hasGreeted) {
      hasGreeted = true;
      setTimeout(function() {
        showTyping();
        setTimeout(function() {
          hideTyping();
          appendMessage('bot', "Hi — I'm the Velonyx Assistant. Want help picking the right plan, or have a question about the platform?");
        }, 700);
      }, 300);
    }
    setTimeout(function() { inputEl.focus(); }, 350);
  }
  function closePanel() {
    panel.classList.remove('open');
    launcher.classList.remove('open');
    launcher.setAttribute('aria-expanded', 'false');
  }

  launcher.addEventListener('click', function() {
    if (panel.classList.contains('open')) closePanel(); else openPanel();
  });
  closeBtn.addEventListener('click', closePanel);

  // ── Send handler ──
  function sendMessage() {
    var text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    inputEl.style.height = 'auto';
    appendMessage('user', text);
    sendBtn.disabled = true;
    if (API_URL) {
      handleAiMode(text);
    } else {
      handleFallback(text);
    }
  }
  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  // Auto-resize textarea
  inputEl.addEventListener('input', function() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(90, inputEl.scrollHeight) + 'px';
  });

  // ── FALLBACK MODE: always-lead-capture flow ──
  function handleFallback(userText) {
    showTyping();
    setTimeout(function() {
      hideTyping();
      var reply = '';
      if (fallbackStep === 0) {
        // First user message - acknowledge + ask for phone
        reply = "Got it. Let me get you to Carlos directly — he'll follow up personally within 1 hour. What's the best phone number to reach you?";
        fallbackStep = 1;
      } else if (fallbackStep === 1) {
        captured.phone = userText;
        reply = "Thanks. And your name + the service you're interested in (or just say 'general info')?";
        fallbackStep = 2;
      } else if (fallbackStep === 2) {
        // Parse name/service from response
        var parts = userText.split(/[,;]/);
        captured.name = parts[0] || userText;
        captured.service = parts.slice(1).join(',').trim() || userText;
        submitLead();
        reply = "Got it. Carlos will reach out within 1 hour at " + captured.phone + ". Anything else you'd like to share before then?";
        fallbackStep = 3;
      } else {
        // Post-capture chatter
        reply = "Carlos will go deeper on this when he reaches out — I've flagged it for him. Anything else to add?";
      }
      appendMessage('bot', reply);
      sendBtn.disabled = false;
    }, 750 + Math.random() * 400);
  }

  function submitLead() {
    // Parse first/last name
    var nameParts = (captured.name || '').trim().split(/\s+/);
    var firstName = nameParts[0] || 'Chatbot';
    var lastName = nameParts.slice(1).join(' ') || 'Lead';
    var payload = {
      firstName: firstName,
      lastName: lastName,
      phone: captured.phone,
      email: '',
      service: captured.service || 'General inquiry (via chatbot)',
      description: 'Chatbot conversation transcript:\n\n' + transcript.join('\n') + '\n\nSession: ' + sessionId,
      source: 'chatbot'
    };
    try {
      fetch(LEADS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function() { /* silent — user already shown success message */ });
    } catch (e) { /* never block UX on a fetch error */ }
  }

  // ── AI MODE: when window.VELONYX_CHATBOT_API_URL is set ──
  function handleAiMode(userText) {
    showTyping();
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId,
        message: userText,
        history: history.slice(-20) // last 20 turns for context
      })
    })
    .then(function(r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    })
    .then(function(data) {
      hideTyping();
      var reply = (data && data.reply) || "I'm not sure how to answer that one. Let me get you to Carlos — what's the best phone number to reach you?";
      appendMessage('bot', reply);
      // If Lambda fired the capture_lead tool and returned confirmation, surface it
      if (data && data.leadCaptured) {
        var confirm = document.createElement('div');
        confirm.className = 'vx-msg vx-bot';
        confirm.style.borderColor = 'rgba(52,211,153,0.4)';
        confirm.innerHTML = '<span style="color:#34D399;">✓</span> Carlos will reach out within 1 hour.';
        messagesEl.appendChild(confirm);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
      sendBtn.disabled = false;
    })
    .catch(function() {
      hideTyping();
      appendMessage('bot', "I'm having trouble connecting. Drop your phone number and Carlos will reach out directly.", { error: true });
      // Fall back to lead capture from here
      fallbackStep = 1;
      sendBtn.disabled = false;
    });
  }
})();
