/* =============================================================================
   iNexa — site behaviour
   Built to the website build specification's motion rules: opacity reveals
   with a vertical entrance of no more than 12px, tab-panel fades, drawer and
   accordion transitions. Nothing exceeds the slow duration token, nothing
   loops, and nothing drives the scroll position.

   Progressive enhancement only: with JavaScript disabled the page is complete
   and readable — reveals are neutralised by the no-js guard, every service
   panel is open, and all navigation links still work.
   ========================================================================== */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktop = window.matchMedia('(min-width: 1024px)');

  /* ---------------------------------------------------------------------
     SCROLL REVEAL
     ------------------------------------------------------------------ */

  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');

    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      var step = parseInt(group.getAttribute('data-stagger'), 10) || 60;
      group.querySelectorAll('[data-reveal]').forEach(function (el, i) {
        el.style.setProperty('--nx-delay', (i * step) + 'ms');
      });
    });

    if (!('IntersectionObserver' in window) || reduced) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------
     NAVIGATION — solid surface after scroll; no blur (spec §11.2)
     ------------------------------------------------------------------ */

  function initNav() {
    var nav = document.querySelector('[data-nav]');
    var ticking = false;

    function onScroll() {
      if (nav) nav.classList.toggle('is-stuck', (window.scrollY || 0) > 24);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    }, { passive: true });

    onScroll();
  }

  /* ---------------------------------------------------------------------
     MOBILE DRAWER
     ------------------------------------------------------------------ */

  function initDrawer() {
    var drawer = document.querySelector('[data-drawer]');
    var toggles = document.querySelectorAll('[data-drawer-toggle]');
    if (!drawer || !toggles.length) return;

    function setDrawer(open) {
      drawer.classList.toggle('is-open', open);
      toggles.forEach(function (btn) { btn.setAttribute('aria-expanded', String(open)); });
      document.body.style.overflow = open ? 'hidden' : '';
    }

    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setDrawer(btn.getAttribute('aria-expanded') !== 'true');
      });
    });

    var closeBtn = drawer.querySelector('[data-drawer-close]');
    if (closeBtn) closeBtn.addEventListener('click', function () { setDrawer(false); });

    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setDrawer(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false);
    });
  }

  /* ---------------------------------------------------------------------
     SECTION TRACKING — marks the current section in the header.
     The marker is an underline: position, not colour alone.
     ------------------------------------------------------------------ */

  function initSectionTracking() {
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-track]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var sections = links
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.setAttribute('aria-current', String(link.getAttribute('href') === '#' + entry.target.id));
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (s) { io.observe(s); });

    window.addEventListener('scroll', function () {
      if ((window.scrollY || 0) < window.innerHeight * 0.5) {
        links.forEach(function (link) { link.removeAttribute('aria-current'); });
      }
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     SERVICES — one DOM, two behaviours (spec §13.4).
     Desktop: a vertical rail where exactly one panel is open, tab-style.
     Below 1024px: an accordion where the open item can also be closed.
     Disclosure semantics (aria-expanded + region) work for both.
     ------------------------------------------------------------------ */

  function initServices() {
    document.querySelectorAll('[data-svc]').forEach(function (group) {
      var tabs = Array.prototype.slice.call(group.querySelectorAll('.nx-svc__tab'));

      function panelOf(tab) {
        return document.getElementById(tab.getAttribute('aria-controls'));
      }

      function open(tab) {
        tabs.forEach(function (other) {
          var on = other === tab;
          other.setAttribute('aria-expanded', String(on));
          var p = panelOf(other);
          if (p) p.hidden = !on;
        });
      }

      function collapse(tab) {
        tab.setAttribute('aria-expanded', 'false');
        var p = panelOf(tab);
        if (p) p.hidden = true;
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
          var isOpen = tab.getAttribute('aria-expanded') === 'true';
          if (isOpen && !desktop.matches) { collapse(tab); return; }
          open(tab);
        });

        /* Arrow-key movement along the rail (spec §19). */
        tab.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 :
                  e.key === 'ArrowUp'   || e.key === 'ArrowLeft'  ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          var next = tabs[(i + d + tabs.length) % tabs.length];
          next.focus();
          if (desktop.matches) open(next);
        });
      });

      /* The markup ships fully open for the no-JS case; collapse to the
         first service once behaviour is attached. */
      open(tabs[0]);

      /* Returning to desktop must never leave everything closed. */
      var onChange = function () {
        if (desktop.matches && !tabs.some(function (t) { return t.getAttribute('aria-expanded') === 'true'; })) {
          open(tabs[0]);
        }
      };
      if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    });
  }

  /* ---------------------------------------------------------------------
     TABS — the operational interface mockups (hero, systems view).
     Approved tab-panel fade; aria-selected carries the state.
     ------------------------------------------------------------------ */

  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (group) {
      var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));

      function select(tab) {
        tabs.forEach(function (other) {
          var on = other === tab;
          other.setAttribute('aria-selected', String(on));
          other.setAttribute('tabindex', on ? '0' : '-1');
          var p = document.getElementById(other.getAttribute('aria-controls'));
          if (p) p.hidden = !on;
        });
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { select(tab); });
        tab.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          var next = tabs[(i + d + tabs.length) % tabs.length];
          next.focus();
          select(next);
        });
      });

      select(tabs[0]);
    });
  }

  /* ------------------------------------------------------------------ */

  function boot() {
    document.documentElement.classList.remove('no-js');
    initNav();
    initDrawer();
    initReveal();
    initServices();
    initTabs();
    initSectionTracking();

    requestAnimationFrame(function () {
      document.body.classList.add('is-ready');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
