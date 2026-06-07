/* Velonyx Slideshow — zero-jank crossfade controller
 * ============================================================================
 * Drives any [data-vx-slideshow] frame containing .vx-slide images.
 *
 * Performance contract (Carlos: "I don't want it delayed"):
 *   - Crossfade animates OPACITY ONLY → GPU compositor thread, never layout.
 *     Physically cannot stutter scrolling or block the main thread.
 *   - IntersectionObserver gates the timer: setInterval runs ONLY while the
 *     frame is on-screen; cleared the moment it scrolls away. Zero CPU idle.
 *   - No requestAnimationFrame, no scroll listeners, no layout reads.
 *   - Respects prefers-reduced-motion (no auto-cycle; first slide static).
 *
 * Graceful: 0 slides → placeholder stays; 1 slide → static; 2+ → crossfades.
 * Matches the existing widget convention (IIFE, defer-loaded external file).
 * ============================================================================ */
(function () {
  if (typeof document === 'undefined') return;

  var INTERVAL_MS = 5000;
  var prefersReduced = false;
  try {
    prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* ignore */ }

  function initOne(frame) {
    var slides = frame.querySelectorAll('.vx-slide');
    if (!slides.length) return;                 // 0 images → placeholder stays

    // Belt-and-suspenders: hide the empty-state placeholder if any real slide
    // exists (covers browsers without :has() support).
    var empty = frame.querySelector('.vx-slideshow-empty');
    if (empty) empty.style.display = 'none';

    // Ensure exactly one slide is active to start.
    var current = 0;
    for (var i = 0; i < slides.length; i++) slides[i].classList.remove('is-active');
    slides[0].classList.add('is-active');

    // 1 slide, or reduced-motion → static. Done.
    if (slides.length < 2 || prefersReduced) return;

    var timer = null;
    var paused = false;
    var inView = false;

    function advance() {
      if (paused) return;
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }
    function start() {
      if (timer) return;
      timer = setInterval(advance, INTERVAL_MS);
    }
    function stop() {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    }

    // Pause on hover (so a visitor reading a slide isn't rushed).
    frame.addEventListener('mouseenter', function () { paused = true; });
    frame.addEventListener('mouseleave', function () { paused = false; });

    // Gate the timer to viewport visibility — the zero-idle-CPU guarantee.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        for (var j = 0; j < entries.length; j++) {
          inView = entries[j].isIntersecting;
          if (inView) start(); else stop();
        }
      }, { threshold: 0.2 });
      io.observe(frame);
    } else {
      // No IO support → just run it; still opacity-only, still cheap.
      start();
    }
  }

  function init() {
    var frames = document.querySelectorAll('[data-vx-slideshow]');
    for (var i = 0; i < frames.length; i++) initOne(frames[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
