const { chromium } = require('playwright');
const { launchOpts, PAGE_URL } = require('./env');
(async () => {
  const b = await chromium.launch(launchOpts);
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await p.goto(PAGE_URL, { waitUntil: 'load' });
  await p.waitForTimeout(700);
  const out = {};
  /* The systems section was two tabs of tables; it is now one always-visible
     integration map, so there is no tab to click. What matters instead is
     that the map draws: four source nodes, each with a spoke, and the spine. */
  await p.evaluate(() => document.querySelector('#systems').scrollIntoView({block:'center'})); await p.waitForTimeout(900);
  out.systemsMap = await p.evaluate(() => {
    const nodes = document.querySelectorAll('.nx-map__node');
    const spine = document.querySelector('.nx-map__spine');
    const drawn = [...nodes].every(n => n.classList.contains('is-in'));
    return nodes.length === 4 && !!spine && spine.classList.contains('is-in') && drawn;
  });
  await p.evaluate(() => document.getElementById('q3-btn').scrollIntoView({block:'center'})); await p.waitForTimeout(300);
  await p.click('#q3-btn'); await p.waitForTimeout(500);
  out.faq = await p.evaluate(() => document.getElementById('q3-btn').getAttribute('aria-expanded')==='true' && document.getElementById('q1-btn').getAttribute('aria-expanded')==='false');
  out.images = await p.evaluate(() => [...document.images].map(i => ({src:i.src.split('/').pop(), loaded:i.complete && i.naturalWidth>0})));
  const p2 = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p2.goto(PAGE_URL, { waitUntil: 'load' });
  await p2.waitForTimeout(600);
  out.lenis = await p2.evaluate(() => document.documentElement.classList.contains('lenis'));
  await p2.evaluate(() => document.querySelector('#trust').scrollIntoView());
  await p2.waitForTimeout(1600);
  out.counter = await p2.evaluate(() => document.querySelector('[data-count="96"]').textContent.trim());
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
