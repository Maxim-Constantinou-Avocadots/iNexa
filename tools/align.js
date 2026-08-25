/* Left-edge alignment. The page frame's promise is that every content edge
   sits at the same x — 129px at 1440 — so that the rails read as one
   continuous frame rather than three competing containers.

   The hero is the exception and is checked differently: its stack is centred,
   so what must hold there is symmetry about the page axis, not a left edge. */

const { chromium } = require('playwright');
const { launchOpts, PAGE_URL } = require('./env');

(async () => {
  const b = await chromium.launch(launchOpts);
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await p.goto(PAGE_URL, { waitUntil: 'load' });
  await p.waitForTimeout(600);

  const out = await p.evaluate(() => {
    const L = s => { const e = document.querySelector(s); return e ? +e.getBoundingClientRect().left.toFixed(1) : null; };
    const R = s => { const e = document.querySelector(s); return e ? +e.getBoundingClientRect().right.toFixed(1) : null; };

    /* Text centre, not box centre — a centred flex box can be centred while
       its words are not. This is what the eyebrow's opening rule got wrong. */
    const textCentre = s => {
      const e = document.querySelector(s);
      if (!e) return null;
      const r = document.createRange();
      r.selectNodeContents(e);
      const box = r.getBoundingClientRect();
      return +((box.left + box.right) / 2).toFixed(1);
    };

    return {
      /* The rail is the drawn line; content sits inside it with padding.
         Two separate promises, so two separate checks. */
      railLines: {
        'hero':      L('.nx-hero .nx-rail'),
        'services':  L('#services .nx-rail'),
        'case':      L('#case-study .nx-rail'),
        'cta':       L('#contact .nx-rail'),
        'hero right': R('.nx-hero .nx-rail')
      },
      contentEdges: {
        'section head left': L('#services .nx-head__title'),
        'nav logo left':     L('.nx-nav__brand'),
        'nav cta right':     R('.nx-nav__actions .inx-btn--primary'),
        'footer logo left':  L('.nx-footer .inx-logo'),
        'dashboard left':    L('.nx-dash')
      },
      heroCentring: {
        'page centre':    window.innerWidth / 2,
        'eyebrow text':   textCentre('.nx-hero .inx-eyebrow'),
        'headline text':  textCentre('.nx-hero__title'),
        'lead text':      textCentre('.nx-hero__lead')
      }
    };
  });

  const lefts = ['section head left', 'nav logo left', 'footer logo left', 'dashboard left']
    .map(k => out.contentEdges[k]).filter(v => v !== null);
  const sameLeft = new Set(lefts).size === 1;

  const rails = ['hero', 'services', 'case', 'cta']
    .map(k => out.railLines[k]).filter(v => v !== null);
  const sameRail = new Set(rails).size === 1;

  const centre = out.heroCentring['page centre'];
  const drift = Object.entries(out.heroCentring)
    .filter(([k]) => k !== 'page centre')
    .map(([k, v]) => [k, v === null ? null : +Math.abs(v - centre).toFixed(2)]);
  const centred = drift.every(([, d]) => d !== null && d <= 1);

  console.log(JSON.stringify(out, null, 1));
  console.log(sameRail
    ? `PASS — every rail line at ${rails[0]}px`
    : `FAIL — rail lines disagree: ${rails.join(', ')}`);
  console.log(sameLeft
    ? `PASS — every content left edge at ${lefts[0]}px`
    : `FAIL — content left edges disagree: ${lefts.join(', ')}`);
  console.log(centred
    ? 'PASS — hero text centred on the page axis (all within 1px)'
    : 'FAIL — hero text off axis: ' + drift.map(([k, d]) => `${k} ${d}px`).join(', '));

  await b.close();
  if (!sameRail || !sameLeft || !centred) process.exitCode = 1;
})();
