const { chromium } = require('playwright');
const { launchOpts, PAGE_URL } = require('./env');
const fs = require('fs');
const OUT = '/tmp/claude-0/-home-user-iNexa/3d766f1e-73d9-59ad-84f1-e0159db52386/scratchpad';

(async () => {
  const browser = await chromium.launch(launchOpts);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('requestfailed', r => errors.push('REQFAIL: ' + r.url() + ' ' + (r.failure()||{}).errorText));

  await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Scroll the whole page to trigger every reveal, then return to top.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 450) {
    await page.evaluate(v => window.scrollTo(0, v), y);
    await page.waitForTimeout(160);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);

  await page.screenshot({ path: OUT + '/full.png', fullPage: true });
  await page.screenshot({ path: OUT + '/hero.png' });

  // Scrolled state, to verify the condensed navbar
  await page.evaluate(() => window.scrollTo(0, 1400));
  await page.waitForTimeout(600);
  await page.screenshot({ path: OUT + '/stuck.png' });

  // Mobile
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await m.goto(PAGE_URL, { waitUntil: 'networkidle' });
  await m.waitForTimeout(900);
  const mh = await m.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < mh; y += 400) { await m.evaluate(v => window.scrollTo(0, v), y); await m.waitForTimeout(120); }
  await m.evaluate(() => window.scrollTo(0, 0));
  await m.waitForTimeout(500);
  await m.screenshot({ path: OUT + '/mobile-full.png', fullPage: true });

  // Horizontal overflow check at several widths
  const widths = [1440, 1280, 1024, 768, 390];
  const overflow = {};
  for (const w of widths) {
    const p = await browser.newPage({ viewport: { width: w, height: 800 } });
    await p.goto(PAGE_URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    overflow[w] = await p.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth
    }));
    await p.close();
  }

  fs.writeFileSync(OUT + '/report.json', JSON.stringify({ errors, overflow }, null, 2));
  console.log(JSON.stringify({ errors, overflow }, null, 2));
  await browser.close();
})();
