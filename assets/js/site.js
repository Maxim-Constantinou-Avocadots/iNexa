/* =============================================================================
   iNexa — site behaviour

   Progressive enhancement only. With JavaScript disabled the page is still
   complete and readable: the reveal styles are removed by the no-js guard at
   the top, the accordion panels fall back to open, and every link still works.
   ========================================================================== */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     SCROLL REVEAL
     One observer for the whole page. Elements declare their own stagger
     through data-stagger on a parent; the delay is written to a custom
     property so the duration and easing stay in the token layer.
     ------------------------------------------------------------------ */

  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal], [data-reveal-group]');

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
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------
     COUNTERS
     Numbers count up once, on entry. The prefix/suffix stay in the markup
     so the real value is present for search engines and screen readers.
     ------------------------------------------------------------------ */

  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window) || reduced) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { io.observe(el); });

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
      var started = null;
      var duration = 900;

      function frame(now) {
        if (started === null) started = now;
        var p = Math.min((now - started) / duration, 1);
        // Matches --inx-ease-out in feel: decisive, settles without bouncing.
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toLocaleString('en-GB', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
        if (p < 1) requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
    }
  }

  /* ---------------------------------------------------------------------
     NAVIGATION
     ------------------------------------------------------------------ */

  function initNav() {
    var nav = document.querySelector('[data-nav]');
    var progress = document.querySelector('[data-progress]');
    var toggle = document.querySelector('[data-drawer-toggle]');
    var drawer = document.querySelector('[data-drawer]');
    var menuBtn = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-menu]');
    var ticking = false;

    function onScroll() {
      var y = window.scrollY || window.pageYOffset;

      if (nav) nav.classList.toggle('is-stuck', y > 24);

      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    }, { passive: true });

    onScroll();

    /* Services panel — click to open, so it is reachable by keyboard and
       usable on touch. Escape and outside-click both close it. */
    if (menuBtn && menu) {
      var closeMenu = function () {
        menu.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      };

      menuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = menuBtn.getAttribute('aria-expanded') === 'true';
        menu.classList.toggle('is-open', !open);
        menuBtn.setAttribute('aria-expanded', String(!open));
      });

      document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && e.target !== menuBtn) closeMenu();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeMenu(); menuBtn.focus(); }
      });

      menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeMenu();
      });
    }

    /* Mobile drawer. The drawer sits above the navigation, so it carries its
       own close control rather than relying on the button that opened it. */
    var toggles = document.querySelectorAll('[data-drawer-toggle]');

    if (toggles.length && drawer) {
      var setDrawer = function (open) {
        drawer.classList.toggle('is-open', open);
        toggles.forEach(function (btn) { btn.setAttribute('aria-expanded', String(open)); });
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) {
          var first = drawer.querySelector('[data-drawer-close]');
          if (first) first.focus();
        } else if (toggle) {
          toggle.focus();
        }
      };

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
  }

  /* ---------------------------------------------------------------------
     SECTION TRACKING
     Marks the current section in the navbar as the page scrolls.
     ------------------------------------------------------------------ */

  function initSectionTracking() {
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-track]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var sections = links
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    var clear = function () {
      links.forEach(function (link) { link.removeAttribute('aria-current'); });
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.setAttribute('aria-current', String(link.getAttribute('href') === '#' + entry.target.id));
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { io.observe(s); });

    /* While the hero still fills the screen the reader is not "in" any of the
       tracked sections, so nothing should be marked as current. */
    window.addEventListener('scroll', function () {
      if (window.scrollY < window.innerHeight * 0.6) clear();
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     ACCORDION
     ------------------------------------------------------------------ */

  function initAccordion() {
    document.querySelectorAll('[data-acc]').forEach(function (group) {
      var buttons = group.querySelectorAll('.nx-acc__btn');

      buttons.forEach(function (btn) {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (!panel) return;

        // Collapse everything first — the markup ships open for the no-JS case.
        var startOpen = btn.getAttribute('aria-expanded') === 'true';
        panel.classList.toggle('is-open', startOpen);

        btn.addEventListener('click', function () {
          var open = btn.getAttribute('aria-expanded') === 'true';

          buttons.forEach(function (other) {
            var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
            other.setAttribute('aria-expanded', 'false');
            if (otherPanel) otherPanel.classList.remove('is-open');
          });

          if (!open) {
            btn.setAttribute('aria-expanded', 'true');
            panel.classList.add('is-open');
          }
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     MARQUEE
     Duplicates the track so the loop has no visible seam.
     ------------------------------------------------------------------ */

  function initMarquee() {
    document.querySelectorAll('[data-marquee]').forEach(function (el) {
      var track = el.querySelector('.nx-marquee__track');
      if (!track || reduced) return;
      var clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      el.appendChild(clone);
    });
  }

  /* ---------------------------------------------------------------------
     SMOOTH SCROLL
     Lenis interpolates the scroll position rather than jumping to it. It is
     the single largest contributor to how expensive a page of this kind
     feels, and it costs about 3KB.

     It is switched off entirely under prefers-reduced-motion: smoothed
     scrolling overrides the operating system's own scroll physics, which is
     exactly what someone setting that preference is asking us not to do.
     ------------------------------------------------------------------ */

  function initSmoothScroll() {
    if (reduced || typeof window.Lenis !== 'function') return null;

    var lenis = new window.Lenis({
      duration: 1.05,
      // Matches --inx-ease-out in character: decisive, settles, never bounces.
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      touchMultiplier: 1.6
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    /* Native anchor jumps and Lenis fight each other, so in-page links are
       handed to Lenis and the fixed navigation height is offset. */
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    });

    return lenis;
  }

  /* ------------------------------------------------------------------ */

  function boot() {
    document.documentElement.classList.remove('no-js');
    initSmoothScroll();
    initNav();
    initReveal();
    initCounters();
    initAccordion();
    initMarquee();
    initSectionTracking();

    // Releases the hero's masked headline once styles have settled.
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
