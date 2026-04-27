/**
 * GDK Mobile Navigation — auto-attaches to every page that includes
 * this script. Reads the existing .gdk-nav-links children, builds a
 * hamburger button + slide-in drawer + backdrop. Industry-standard
 * mobile nav pattern.
 *
 * No setup needed: just <script src="/demos/garage/assets/nav-mobile.js"></script>
 * on any page with a .gdk-nav element.
 */
(function () {
  function init() {
    const navInner = document.querySelector('.gdk-nav-inner');
    const navLinks = document.querySelector('.gdk-nav-links');
    if (!navInner || !navLinks) return;
    if (document.querySelector('.gdk-burger')) return; // already initialized

    // Build hamburger button
    const burger = document.createElement('button');
    burger.type = 'button';
    burger.className = 'gdk-burger';
    burger.setAttribute('aria-label', 'Open navigation menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';

    // Insert burger before the existing mobile-cta button (so order is logo … burger | cta)
    const mobileCta = navInner.querySelector('.gdk-nav-mobile-cta');
    if (mobileCta) {
      navInner.insertBefore(burger, mobileCta);
    } else {
      navInner.appendChild(burger);
    }

    // Build drawer + backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'gdk-mobile-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);

    const drawer = document.createElement('aside');
    drawer.className = 'gdk-mobile-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', 'Site navigation');

    // Drawer header (close + brand)
    const drawerHeader = document.createElement('div');
    drawerHeader.className = 'gdk-mobile-drawer-head';
    drawerHeader.innerHTML = `
      <span class="gdk-mobile-drawer-label">Menu</span>
      <button type="button" class="gdk-mobile-drawer-close" aria-label="Close menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    drawer.appendChild(drawerHeader);

    // Drawer body — clone the nav links + buttons
    const drawerBody = document.createElement('div');
    drawerBody.className = 'gdk-mobile-drawer-body';
    Array.from(navLinks.children).forEach(child => {
      const tag = child.tagName.toLowerCase();
      if (tag !== 'a' && tag !== 'button') return;
      const clone = child.cloneNode(true);
      // Strip any inline color overrides so drawer styling owns it
      clone.removeAttribute('style');
      // Strip CTA/btn styling — drawer has its own row style
      if (tag === 'button') {
        clone.classList.remove('gdk-btn', 'gdk-btn-primary', 'gdk-btn-outline', 'gdk-btn-small', 'gdk-btn-payment-cta', 'gdk-btn-take-now');
      }
      drawerBody.appendChild(clone);
    });
    drawer.appendChild(drawerBody);

    document.body.appendChild(drawer);

    // Wire open/close
    function open() {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('gdk-no-scroll');
    }
    function close() {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('gdk-no-scroll');
    }
    burger.addEventListener('click', () => {
      if (drawer.classList.contains('open')) close(); else open();
    });
    backdrop.addEventListener('click', close);
    drawer.querySelector('.gdk-mobile-drawer-close').addEventListener('click', close);
    drawer.addEventListener('click', (e) => {
      // Close if a link inside is clicked (let the navigation happen first)
      if (e.target.closest('a')) {
        setTimeout(close, 50);
      } else if (e.target.closest('button.gdk-mobile-drawer-close')) {
        close();
      } else if (e.target.tagName === 'BUTTON') {
        // Sign out etc — keep open briefly so the action can fire, then close
        setTimeout(close, 50);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });

    // If an item in the drawer is the data-signout button, re-bind so it triggers gdkSignOut
    drawer.querySelectorAll('[data-signout]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.gdkSignOut) window.gdkSignOut('/demos/garage/');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
