const { chromium } = require('playwright');
const { launchOpts, PAGE_URL } = require('./env');
(async () => {
  const b = await chromium.launch(launchOpts);
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(PAGE_URL, { waitUntil: 'load' });
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    // Palette = the six approved brand colours plus the derived ramp.
    const approved = new Set(['#FFFFFF','#F5F7FA','#ECF1F7','#DAE5F1','#B8D0E5','#9DB4CA','#8096AD','#5E738A','#495B6F','#354456','#243040','#141D2B','#070B14','#04070D','#2A6B57','#63C09B','#8A6212','#D9A54F','#A83232','#E88A87']);
    const hex = c => { const m = c.match(/^rgb\((\d+), (\d+), (\d+)\)$/); return m ? '#'+[1,2,3].map(i=>(+m[i]).toString(16).padStart(2,'0')).join('').toUpperCase() : null; };
    const bad = [];
    const label = el => el.tagName.toLowerCase()+'.'+String(el.className||'').trim().split(/\s+/).join('.');
    document.querySelectorAll('body *').forEach(el => {
      const s = getComputedStyle(el);
      const check = (val, what) => { const h = hex(val); if (h && !approved.has(h)) bad.push(what+' '+h+' on '+label(el)); };
      check(s.color, 'text');                                  // text always paints
      if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') check(s.backgroundColor, 'bg');
      ['Top','Right','Bottom','Left'].forEach(side => {
        if (s['border'+side+'Style'] !== 'none' && parseFloat(s['border'+side+'Width']) > 0)
          check(s['border'+side+'Color'], 'border');
      });
      if (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) check(s.outlineColor, 'outline');
    });
    return [...new Set(bad)];
  });
  console.log(r.length ? JSON.stringify(r, null, 1) : 'PASS — every painted colour is inside the approved palette / derived ramp');
  await b.close();
})();
