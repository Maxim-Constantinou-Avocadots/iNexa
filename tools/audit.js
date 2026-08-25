const { chromium } = require('playwright');
const { launchOpts, PAGE_URL } = require('./env');
(async () => {
  const b = await chromium.launch(launchOpts);
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type()==='error') errs.push('CONSOLE ' + m.text()); });
  await p.goto(PAGE_URL, { waitUntil: 'load' });
  await p.waitForTimeout(800);

  const r = await p.evaluate(() => {
    const out = {};
    // Approved palette: the six brand colours + the derived ramp only.
    const approved = new Set(['#FFFFFF','#F5F7FA','#ECF1F7','#DAE5F1','#B8D0E5','#9DB4CA','#8096AD','#5E738A','#495B6F','#354456','#243040','#141D2B','#070B14','#04070D']);
    const toHex = c => {
      const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return null;
      return '#' + [1,2,3].map(i => (+m[i]).toString(16).padStart(2,'0')).join('').toUpperCase();
    };
    const stray = new Map();
    document.querySelectorAll('*').forEach(el => {
      const s = getComputedStyle(el);
      ['color','backgroundColor','borderTopColor','borderLeftColor'].forEach(prop => {
        const v = s[prop];
        if (!v || v === 'rgba(0, 0, 0, 0)' || v.startsWith('rgba')) return;
        const hex = toHex(v);
        if (hex && !approved.has(hex)) stray.set(hex, (stray.get(hex)||0)+1);
      });
      if (s.backgroundImage.includes('gradient') && !s.maskImage.includes('gradient') && el.className !== 'nx-marquee') {
        (out.gradients = out.gradients || []).push(el.className + ' :: ' + s.backgroundImage.slice(0,60));
      }
    });
    out.strayColours = [...stray.entries()];

    // Font weights actually used
    const weights = new Set();
    const fams = new Set();
    document.querySelectorAll('*').forEach(el => {
      if (!el.textContent.trim()) return;
      const s = getComputedStyle(el);
      weights.add(s.fontWeight);
      fams.add(s.fontFamily.split(',')[0].replace(/["']/g,''));
    });
    out.fontWeights = [...weights].sort();
    out.fontFamilies = [...fams];

    // Accessibility structure
    out.headings = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => h.tagName + ' ' + h.textContent.trim().replace(/\s+/g,' ').slice(0,45));
    out.h1Count = document.querySelectorAll('h1').length;
    out.imgsMissingAlt = [...document.querySelectorAll('img')].filter(i => !i.alt).length;
    out.buttonsNoLabel = [...document.querySelectorAll('button')].filter(x => !x.textContent.trim() && !x.getAttribute('aria-label')).length;
    out.linksNoLabel = [...document.querySelectorAll('a')].filter(x => !x.textContent.trim() && !x.getAttribute('aria-label')).length;
    out.svgNoRole = [...document.querySelectorAll('svg')].filter(s => !s.getAttribute('aria-hidden') && !s.getAttribute('role')).length;
    out.langAttr = document.documentElement.lang;
    out.duplicateIds = (() => {
      const seen = {}, dup = [];
      document.querySelectorAll('[id]').forEach(e => { if (seen[e.id]) dup.push(e.id); seen[e.id]=1; });
      return dup;
    })();
    // Transition durations should stay inside the token set
    const durs = new Set();
    document.querySelectorAll('*').forEach(el => {
      const d = getComputedStyle(el).transitionDuration;
      if (d && d !== '0s') d.split(', ').forEach(x => durs.add(x));
    });
    out.transitionDurations = [...durs].sort();
    return out;
  });

  console.log(JSON.stringify({ errs, ...r }, null, 1));
  await b.close();
})();
