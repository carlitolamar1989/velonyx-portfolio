/**
 * Velonyx LIVE chat widget — the real AI, not a script.
 *
 * Talks to the production Velonyx platform (the same brain that answers
 * (877) 317-8643 and the DMs). Replaces the old canned demo widget.
 *
 * - Golden-orb avatar (canvas): idle breathing → "thinking" swirl while the
 *   AI works → "speaking" pulse while the reply types out. Matches the
 *   story-banner orb art (gold/blue energy knot on deep navy).
 * - A2P: the SMS-consent checkbox is rendered NON-pre-checked; the platform
 *   also enforces consent server-side before storing any number.
 * - Perf: defer-loaded, zero work before DOMContentLoaded, no layout shift
 *   (fixed launcher), animation pauses when hidden; honors reduced motion.
 *
 * Also exposes window.VelonyxOrb.mount(canvas) so page sections (the "Meet
 * Velonyx" block) can render the same living orb, and
 * window.VelonyxChat.open() for CTA buttons.
 */
(function () {
  "use strict";

  var API_URL = "https://velonyx-platform.vercel.app/api/chat";
  var GOLD = "#D4AF37";
  var BLUE = "#4DA3FF";
  var CYAN = "#6EE7FF";
  var NAVY = "#0B0E1A";
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────────────────────── ORB ───────────────────────── */

  function mountOrb(canvas, opts) {
    opts = opts || {};
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = opts.size || canvas.clientWidth || 64;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    var ctx = canvas.getContext("2d");
    var state = "idle"; // idle | thinking | speaking
    var t = Math.random() * 100;
    var raf = null;
    var visible = true;

    var RIBBONS = [
      { color: GOLD, rx: 0.42, ry: 0.16, tilt: 0.5, speed: 1.0, width: 2.2 },
      { color: CYAN, rx: 0.40, ry: 0.20, tilt: 2.1, speed: -1.35, width: 1.6 },
      { color: GOLD, rx: 0.36, ry: 0.24, tilt: 3.9, speed: 1.7, width: 1.4 },
      { color: BLUE, rx: 0.43, ry: 0.13, tilt: 5.2, speed: -0.8, width: 1.8 },
      { color: "#F5DFA0", rx: 0.30, ry: 0.27, tilt: 1.2, speed: 2.2, width: 1.0 },
    ];

    function frame() {
      var s = canvas.width; // square, device px
      var c = s / 2;
      var mode = state === "thinking" ? 2.6 : state === "speaking" ? 1.7 : 1;
      var glow = state === "idle" ? 1 : 1.45;
      t += 0.016 * mode;
      var breathe = 1 + Math.sin(t * 1.8) * (state === "speaking" ? 0.06 : 0.025);

      ctx.clearRect(0, 0, s, s);

      // core glow
      var g = ctx.createRadialGradient(c, c, 0, c, c, c * 0.5 * breathe);
      g.addColorStop(0, "rgba(255,236,170," + 0.85 * glow * 0.7 + ")");
      g.addColorStop(0.45, "rgba(212,175,55," + 0.4 * glow * 0.7 + ")");
      g.addColorStop(1, "rgba(77,163,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(c, c, c * 0.5 * breathe, 0, Math.PI * 2);
      ctx.fill();

      // swirling ribbons — rotating tilted ellipses read as an energy knot
      for (var i = 0; i < RIBBONS.length; i++) {
        var r = RIBBONS[i];
        var rot = r.tilt + t * r.speed * 0.6;
        ctx.save();
        ctx.translate(c, c);
        ctx.rotate(rot);
        ctx.scale(breathe, breathe);
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = state === "idle" ? 0.75 : 0.95;
        ctx.lineWidth = r.width * (s / 128);
        ctx.shadowColor = r.color;
        ctx.shadowBlur = (state === "idle" ? 6 : 12) * (s / 128);
        ctx.beginPath();
        ctx.ellipse(0, 0, s * r.rx, s * r.ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // orbit sparks
      ctx.globalAlpha = 1;
      for (var p = 0; p < 7; p++) {
        var a = t * (0.7 + p * 0.13) + p * 0.9;
        var rad = c * (0.62 + 0.1 * Math.sin(t + p));
        var px = c + Math.cos(a) * rad;
        var py = c + Math.sin(a) * rad * 0.55;
        ctx.fillStyle = p % 2 ? CYAN : GOLD;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 8 * (s / 128);
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, s / 90), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    function loop() {
      frame();
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (raf === null && !reduceMotion && visible && !document.hidden) {
        raf = requestAnimationFrame(loop);
      }
    }
    function stop() {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        visible ? start() : stop();
      }).observe(canvas);
    }
    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : start();
    });

    frame(); // always render at least one frame (reduced-motion gets a still)
    start();

    return {
      setState: function (s) {
        state = s;
      },
      destroy: stop,
    };
  }

  window.VelonyxOrb = { mount: mountOrb };

  /* ──────────────────────── WIDGET ─────────────────────── */

  var css =
    "#vxlc-launch{position:fixed;left:20px;bottom:20px;z-index:9998;width:64px;height:64px;border-radius:50%;border:1px solid rgba(212,175,55,.45);background:radial-gradient(circle at 50% 40%," + NAVY + " 0%,#060810 100%);cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.5),0 0 18px rgba(212,175,55,.25);padding:0;transition:transform .15s ease}" +
    "#vxlc-launch:hover{transform:scale(1.07)}" +
    "#vxlc-launch canvas{width:100%;height:100%;display:block}" +
    "#vxlc-panel{position:fixed;left:20px;bottom:96px;z-index:9999;width:378px;max-width:calc(100vw - 40px);height:560px;max-height:min(72vh,560px);display:none;flex-direction:column;background:linear-gradient(180deg,#0D1020 0%,#08080A 100%);border:1px solid rgba(212,175,55,.35);border-radius:18px;overflow:hidden;box-shadow:0 18px 60px rgba(0,0,0,.65);font-family:'DM Sans',system-ui,sans-serif}" +
    "#vxlc-panel.open{display:flex}" +
    "@media (max-width:520px){#vxlc-panel{left:10px;right:10px;bottom:86px;width:auto;height:70vh}}" +
    "#vxlc-head{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid rgba(212,175,55,.2);background:rgba(212,175,55,.06)}" +
    "#vxlc-head canvas{width:38px;height:38px}" +
    "#vxlc-head .t{flex:1;min-width:0}" +
    "#vxlc-head .t b{display:block;color:#F0EDE8;font-family:'Space Grotesk',sans-serif;font-size:15px;letter-spacing:.02em}" +
    "#vxlc-head .t span{display:block;color:rgba(240,237,232,.55);font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    "#vxlc-close{background:none;border:0;color:rgba(240,237,232,.6);font-size:22px;line-height:1;cursor:pointer;padding:4px 8px}" +
    "#vxlc-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}" +
    ".vxlc-m{max-width:85%;padding:9px 13px;border-radius:14px;font-size:14px;line-height:1.45;color:#F0EDE8;white-space:pre-wrap;word-wrap:break-word}" +
    ".vxlc-ai{align-self:flex-start;background:rgba(212,175,55,.12);border:1px solid rgba(212,175,55,.22);border-bottom-left-radius:4px}" +
    ".vxlc-me{align-self:flex-end;background:rgba(77,163,255,.14);border:1px solid rgba(77,163,255,.28);border-bottom-right-radius:4px}" +
    ".vxlc-dots{align-self:flex-start;color:rgba(240,237,232,.6);font-size:18px;letter-spacing:3px;padding:4px 13px}" +
    "#vxlc-consent{display:flex;gap:8px;align-items:flex-start;padding:8px 14px 0;font-size:11px;color:rgba(240,237,232,.55);line-height:1.4}" +
    "#vxlc-consent input{margin-top:2px;accent-color:" + GOLD + "}" +
    "#vxlc-consent a{color:" + GOLD + ";text-decoration:none}" +
    "#vxlc-form{display:flex;gap:8px;padding:10px 14px 14px}" +
    "#vxlc-in{flex:1;background:#12141F;border:1px solid rgba(240,237,232,.18);border-radius:10px;color:#F0EDE8;font-size:14px;padding:11px 12px;outline:none;font-family:inherit}" +
    "#vxlc-in:focus{border-color:rgba(212,175,55,.55)}" +
    "#vxlc-send{background:" + GOLD + ";color:#08080A;border:0;border-radius:10px;font-weight:700;font-size:14px;padding:0 16px;cursor:pointer;font-family:'Space Grotesk',sans-serif}" +
    "#vxlc-send:disabled{opacity:.5;cursor:default}";

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (html) e.innerHTML = html;
    return e;
  }

  function init() {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    // Launcher
    var launch = el("button", {
      id: "vxlc-launch",
      "aria-label": "Chat with the Velonyx AI — live",
      title: "Talk to the Velonyx AI — it's live",
    });
    var launchCanvas = el("canvas", {});
    launch.appendChild(launchCanvas);
    document.body.appendChild(launch);
    var launchOrb = mountOrb(launchCanvas, { size: 64 });

    // Panel
    var panel = el("div", { id: "vxlc-panel", role: "dialog", "aria-label": "Velonyx live AI chat" });
    panel.innerHTML =
      '<div id="vxlc-head"><canvas></canvas><div class="t"><b>Velonyx — Live AI</b>' +
      "<span>The same AI that answers (877) 317-8643. Not a script.</span></div>" +
      '<button id="vxlc-close" aria-label="Close chat">&times;</button></div>' +
      '<div id="vxlc-log"></div>' +
      '<label id="vxlc-consent"><input type="checkbox" id="vxlc-ok"><span>OK to text me at a number I share here (booking confirmations &amp; replies; msg/data rates may apply; reply STOP to opt out — <a href="/sms-terms.html" target="_blank" rel="noopener">SMS terms</a>)</span></label>' +
      '<form id="vxlc-form"><input id="vxlc-in" autocomplete="off" placeholder="Ask anything — or book a call right here" aria-label="Message"><button id="vxlc-send" type="submit">Send</button></form>';
    document.body.appendChild(panel);

    var headOrb = mountOrb(panel.querySelector("#vxlc-head canvas"), { size: 38 });
    var log = panel.querySelector("#vxlc-log");
    var input = panel.querySelector("#vxlc-in");
    var send = panel.querySelector("#vxlc-send");
    var consent = panel.querySelector("#vxlc-ok");
    var busy = false;
    var greeted = false;

    var sid = null;
    try {
      sid = sessionStorage.getItem("vx_chat_sid");
      if (!sid) {
        sid = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : "vx" + Date.now() + Math.random().toString(16).slice(2);
        sessionStorage.setItem("vx_chat_sid", sid);
      }
    } catch (e) {
      sid = "vx" + Date.now() + Math.random().toString(16).slice(2);
    }

    function bubble(cls, text) {
      var b = el("div", { class: "vxlc-m " + cls });
      b.textContent = text;
      log.appendChild(b);
      log.scrollTop = log.scrollHeight;
      return b;
    }

    function setOrbs(s) {
      launchOrb.setState(s);
      headOrb.setState(s);
    }

    function typeOut(target, text, done) {
      if (reduceMotion) {
        target.textContent = text;
        log.scrollTop = log.scrollHeight;
        done();
        return;
      }
      var i = 0;
      var step = Math.max(1, Math.round(text.length / 80)); // ~1.5s max
      (function tick() {
        i = Math.min(text.length, i + step);
        target.textContent = text.slice(0, i);
        log.scrollTop = log.scrollHeight;
        if (i < text.length) setTimeout(tick, 18);
        else done();
      })();
    }

    function ask(message) {
      busy = true;
      send.disabled = true;
      setOrbs("thinking");
      var dots = el("div", { class: "vxlc-dots", "aria-hidden": "true" }, "•••");
      log.appendChild(dots);
      log.scrollTop = log.scrollHeight;

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, message: message, smsConsent: consent.checked }),
      })
        .then(function (r) {
          if (!r.ok) throw new Error("http " + r.status);
          return r.json();
        })
        .then(function (data) {
          dots.remove();
          setOrbs("speaking");
          var b = bubble("vxlc-ai", "");
          typeOut(b, data.reply || "…", function () {
            setOrbs("idle");
            busy = false;
            send.disabled = false;
          });
        })
        .catch(function () {
          dots.remove();
          setOrbs("idle");
          bubble(
            "vxlc-ai",
            "I hit a connection snag — try again in a moment, or just call me: (877) 317-8643. Yes, I answer the phone too."
          );
          busy = false;
          send.disabled = false;
        });
    }

    function open() {
      panel.classList.add("open");
      if (!greeted) {
        greeted = true;
        bubble(
          "vxlc-ai",
          "Hey — I'm the Velonyx AI, and this is live, not a demo script. Ask me what we build, what it costs, or book a call with Carlos right here in the chat. I'm also the one answering (877) 317-8643 — try me."
        );
      }
      setTimeout(function () {
        input.focus();
      }, 50);
      if (window.gtag) try { window.gtag("event", "vx_live_chat_open"); } catch (e) {}
    }
    function close() {
      panel.classList.remove("open");
    }

    launch.addEventListener("click", function () {
      panel.classList.contains("open") ? close() : open();
    });
    panel.querySelector("#vxlc-close").addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    panel.querySelector("#vxlc-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v || busy) return;
      bubble("vxlc-me", v);
      input.value = "";
      ask(v);
    });

    // Living orbs for page sections: <canvas data-vx-orb></canvas>
    var sectionOrbs = document.querySelectorAll("canvas[data-vx-orb]");
    for (var i = 0; i < sectionOrbs.length; i++) {
      mountOrb(sectionOrbs[i], { size: sectionOrbs[i].clientWidth || 220 });
    }
    // CTA hooks: <a data-vx-chat-open>
    var openers = document.querySelectorAll("[data-vx-chat-open]");
    for (var j = 0; j < openers.length; j++) {
      openers[j].addEventListener("click", function (e) {
        e.preventDefault();
        open();
      });
    }

    window.VelonyxChat = { open: open, close: close };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
