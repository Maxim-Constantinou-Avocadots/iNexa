/* Stamps a content hash onto every versioned asset URL in the site's HTML.

   Why this runs here and not in the deploy workflow: GitHub Pages on this
   repository publishes the BRANCH, not the workflow artifact. The workflow's
   own rewrite step ran and reported success on every deploy, but visitors
   were still served `?v=dev` — the artifact it edited is not what Pages puts
   online. Anything that has to reach a visitor therefore has to be committed.

   What it buys: Pages sends `cache-control: max-age=600` on HTML *and* CSS,
   and the two expire independently, so a visitor can get new markup beside a
   ten-minute-old stylesheet — which renders any newly added section
   completely unstyled. That failure hit this project twice. A version token
   tied to the asset's own bytes means each HTML revision asks for exactly the
   asset revision it was built against.

   A content hash rather than the commit SHA, deliberately: it changes only
   when the asset changes, so a copy edit does not invalidate every cached
   stylesheet, and running this twice on an unchanged tree is a no-op.

   Usage:  node tools/stamp.js          rewrite and report
           node tools/stamp.js --check  exit 1 if anything is stale
*/

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const check = process.argv.includes('--check');

/* Pages that ship. `previous/` is a frozen snapshot and is left alone. */
const PAGES = [
  'index.html',
  'about/index.html',
  'case-study/index.html',
  'services/index.html',
  'contact/index.html',
  'faq/index.html',
];

const hashes = new Map();
function hashOf(file) {
  if (!hashes.has(file)) {
    hashes.set(file, crypto.createHash('sha256')
      .update(fs.readFileSync(file))
      .digest('hex').slice(0, 8));
  }
  return hashes.get(file);
}

let stale = 0;
let rewritten = 0;

for (const page of PAGES) {
  const abs = path.join(ROOT, page);
  const dir = path.dirname(abs);
  const before = fs.readFileSync(abs, 'utf8');

  const after = before.replace(
    /((?:href|src)=")([^"?]+\.(?:css|js))\?v=([^"]*)(")/g,
    (whole, lead, url, current, tail) => {
      const asset = path.resolve(dir, url);
      if (!fs.existsSync(asset)) {
        console.error('MISSING ASSET  ' + page + '  ->  ' + url);
        process.exitCode = 1;
        return whole;
      }
      const want = hashOf(asset);
      if (want !== current) {
        stale++;
        if (check) console.error('STALE  ' + page + '  ' + url + '  ?v=' + current + ' -> ?v=' + want);
      }
      return lead + url + '?v=' + want + tail;
    }
  );

  if (after !== before) {
    if (!check) { fs.writeFileSync(abs, after); rewritten++; }
  }
}

if (check) {
  if (stale) {
    console.error('\n' + stale + ' asset link(s) out of date. Run: node tools/stamp.js');
    process.exit(1);
  }
  console.log('PASS — every asset link carries its asset\'s current content hash');
} else {
  console.log(rewritten
    ? 'Stamped ' + stale + ' link(s) across ' + rewritten + ' page(s)'
    : 'Nothing to do — every asset link already current');
}
