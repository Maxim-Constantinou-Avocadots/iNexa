const { chromium } = require('playwright');
const { launchOpts, PAGE_URL } = require('./env');
const VP = [[1920,1080],[1600,900],[1440,900],[1440,800],[1366,768],[1280,720],[1024,768],[820,1180],[768,1024],[430,932],[390,844],[390,667],[360,640]];
(async () => {
  const b = await chromium.launch(launchOpts);
  let bad = 0;
  for (const [w,h] of VP) {
    const p = await b.newPage({ viewport:{width:w,height:h}, reducedMotion:'reduce' });
    await p.goto(PAGE_URL);
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => {
      const hero = document.querySelector('.nx-hero');
      const next = document.querySelector('#trust');
      return {
        hero: Math.round(hero.getBoundingClientRect().height),
        nextTop: Math.round(next.getBoundingClientRect().top + window.scrollY),
        ov: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    });
    const screens = r.nextTop / h;
    const ok = screens <= 1.4 && r.ov <= 0;
    if (!ok) bad++;
    console.log(`${(w+'x'+h).padEnd(10)} hero ${String(r.hero).padStart(4)}px  next at ${screens.toFixed(2)} screens ${ok?'OK':'XX'}  overflow ${r.ov}`);
    await p.close();
  }
  console.log(bad ? `\n${bad} still over.` : '\nAll within 1.4 screens.');
  await b.close();
})();
