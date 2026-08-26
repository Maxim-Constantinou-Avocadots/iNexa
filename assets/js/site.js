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

    /* A [data-track] link is only an in-page anchor on the homepage; on a
       sub-page the same nav points at ../index.html#section, which is not a
       valid selector and threw here. Take the fragment, and only when the
       href is a bare fragment to begin with. */
    var sections = links
      .map(function (link) {
        var href = link.getAttribute('href') || '';
        return href.charAt(0) === '#' && href.length > 1
          ? document.getElementById(href.slice(1))
          : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

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
     TABS — approved tab-panel fade; aria-selected carries the state.

     NOTE: no markup currently uses [data-tabs]. The systems section was the
     last consumer and is now an always-visible integration map. This is kept
     because .inx-tabs is a documented component of the design system, so the
     next section that needs tabs should not have to reimplement the
     behaviour — it no-ops when there is nothing to bind.
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

  /* ---------------------------------------------------------------------
     SMOOTH SCROLL — Lenis, approved by the client as an amendment to the
     build spec's motion list. Disabled under prefers-reduced-motion, since
     smoothed scrolling overrides the OS's own scroll physics.
     ------------------------------------------------------------------ */

  function initSmoothScroll() {
    if (reduced || typeof window.Lenis !== 'function') return;

    var lenis = new window.Lenis({
      duration: 1.05,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      touchMultiplier: 1.6
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

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
  }

  /* ---------------------------------------------------------------------
     COUNTERS — count up once on entry. Kept by client decision; the values
     are sample figures and their sections say so in visible text.
     ------------------------------------------------------------------ */

  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length || !('IntersectionObserver' in window) || reduced) return;

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
      var started = null;

      function frame(now) {
        if (started === null) started = now;
        var p = Math.min((now - started) / 900, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-GB');
        if (p < 1) requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
    }
  }

  /* ---------------------------------------------------------------------
     FAQ ACCORDION — single-open; the markup ships open for no-JS.
     ------------------------------------------------------------------ */

  function initAccordion() {
    document.querySelectorAll('[data-acc]').forEach(function (group) {
      var buttons = group.querySelectorAll('.nx-acc__btn');

      buttons.forEach(function (btn) {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (!panel) return;
        panel.classList.toggle('is-open', btn.getAttribute('aria-expanded') === 'true');

        btn.addEventListener('click', function () {
          var open = btn.getAttribute('aria-expanded') === 'true';
          buttons.forEach(function (other) {
            other.setAttribute('aria-expanded', 'false');
            var p = document.getElementById(other.getAttribute('aria-controls'));
            if (p) p.classList.remove('is-open');
          });
          if (!open) {
            btn.setAttribute('aria-expanded', 'true');
            panel.classList.add('is-open');
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------ */

  /* ---------------------------------------------------------------------
     PLOT HOVER
     The tooltip enhances the chart; it never gates it. Every value is also
     in the visually-hidden table twin beside the plot, the endpoint is
     directly labelled, and the axis carries the rest — so a reader with no
     pointer, no JavaScript or a screen reader loses nothing.

     Hit targets are full-height column rects, not the 2px line, so landing
     on a value never requires precision.
     ------------------------------------------------------------------ */

  function initPlot() {
    var plot = document.querySelector('.nx-plot');
    if (!plot) return;

    var frame = plot.querySelector('.nx-plot__frame');
    var tip = plot.querySelector('.nx-plot__tip');
    var cross = plot.querySelector('.nx-plot__cross');
    var dot = plot.querySelector('.nx-plot__hover');
    var hits = plot.querySelectorAll('.nx-plot__hits > span');
    if (!frame || !tip || !cross || !dot || !hits.length) return;

    function show(hit) {
      var x = hit.getAttribute('data-x');
      var y = hit.getAttribute('data-y');

      /* data-x / data-y are unitless numbers; without the unit the custom
         property is invalid in a length context and the mark snaps to 0. */
      cross.style.setProperty('--nx-x', x + '%');
      cross.hidden = false;

      dot.style.setProperty('--nx-x', x + '%');
      dot.style.setProperty('--nx-y', y + '%');
      dot.hidden = false;

      tip.querySelector('.nx-plot__tip-w').textContent =
        'Week ' + hit.getAttribute('data-week');
      tip.querySelector('.nx-plot__tip-v').textContent =
        hit.getAttribute('data-value') + ' touchpoints';
      tip.hidden = false;

      /* The tip is positioned against the frame, whose plot area starts
         30px in from the left for the y-axis labels. */
      var inset = 30;
      var w = frame.clientWidth - inset;
      tip.style.left = (inset + (parseFloat(x) / 100) * w) + 'px';
      tip.style.top = ((parseFloat(y) / 100) * frame.clientHeight) + 'px';
    }

    function hide() {
      tip.hidden = true;
      cross.hidden = true;
      dot.hidden = true;
    }

    Array.prototype.forEach.call(hits, function (hit) {
      hit.addEventListener('mouseenter', function () { show(hit); });
    });
    plot.addEventListener('mouseleave', hide);
  }

  function boot() {
    document.documentElement.classList.remove('no-js');
    initSmoothScroll();
    initNav();
    initDrawer();
    initReveal();
    initServices();
    initTabs();
    initAccordion();
    initCounters();
    initPlot();
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
