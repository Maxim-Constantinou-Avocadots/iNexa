const { chromium } = require('playwright');
const { launchOpts, PAGE_URL } = require('./env');
(async () => {
  const b = await chromium.launch(launchOpts);
  for (const w of [1440, 1360, 1280, 1180, 1100, 1040, 1024, 900, 768, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 800 } });
    await p.goto(PAGE_URL, { waitUntil: 'load' });
    await p.waitForTimeout(500);
    const r = await p.evaluate(() => {
      const bar = document.querySelector('.nx-nav__bar').getBoundingClientRect();
      const act = document.querySelector('.nx-nav__actions').getBoundingClientRect();
      return {
        over: +(act.right - bar.right).toFixed(1),
        pageOver: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    });
    console.log(`${String(w).padStart(5)}px  nav overflow ${String(r.over).padStart(7)}  page overflow ${r.pageOver}`);
    await p.close();
  }
  await b.close();
})();
