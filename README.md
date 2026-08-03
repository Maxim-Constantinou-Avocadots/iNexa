# iNexa — Homepage

A production-ready homepage mockup built on the iNexa Design System v1.0.

Open `index.html` in a browser. There is no build step, no framework and no
network dependency — the typeface is embedded, so it renders identically from
disk, from a static host, or inside an embedded preview.

```
index.html
assets/
  css/
    fonts.css               Manrope, self-hosted (data URI)
    inexa-tokens.css        Token layer, from the style guide
    inexa-components.css    Component layer, from the style guide
    site.css                Marketing layer for this page (nx- prefix)
  js/
    site.js                 Progressive enhancement only
    vendor/lenis.min.js     Smooth scroll (MIT)
  fonts/
    manrope-latin.woff2     Raw files, for production hosting
    manrope-latin-ext.woff2
```

## The page

Fourteen sections, matching the reference page's architecture one-for-one.

| # | Section | Surface | Does |
|---|---------|---------|------|
| 1 | Hero | Ink | The manual's positioning line as the headline, plus an operating readout panel |
| 2 | Why iNexa | White | Three figures and two attributed results |
| 3 | Problem vs Solution | Sunken | Five paired rows: what breaks, and what it looks like under management |
| 4 | Services | White | The four services as a set — deliberately unnumbered |
| 5 | Before and After | Ink | Three measured outcomes across engagements |
| 6 | Featured Engagement | White | A twelve-month case: before/after table, quote, two figures |
| 7 | Industries | Sunken | Ticker plus six sector tiles |
| 8 | Systems | White | Which categories of system we operate inside |
| 9 | How We Work | Ink | Assess → Design → Implement → Manage, the one sequential block |
| 10 | Testimonials | White | Three attributed results |
| 11 | Engagement Model | Sunken | Three tiers, the recommended one inverted to ink |
| 12 | Insights | White | Three article previews |
| 13 | Questions | Sunken | Five-item accordion, sticky heading column |
| 14 | Contact | Ink | Closing billboard, the short-form promise as the closing line |

**Message.** One claim, carried the whole way down: iNexa takes ownership of the
operating layer so leadership can spend its time on growth. Every section
anchors on a measured figure rather than an adjective — the device the reference
page uses throughout, where even its metrics are marked up as headings.

## Structure

Measured against the reference the brief pointed at (oma-operator.framer.website),
whose actual CSS gives a 1199px container, an ~809px text measure, 140% body
leading and −0.02 to −0.06em display tracking. This page follows the same
discipline:

- **1200px container.** A wider one pushes lines past comfortable reading length
  and makes a page feel empty and cramped at the same time.
- **One left margin.** The navigation logo, every eyebrow, every headline, every
  card and the footer all begin on the same x. The navbar's contents sit in the
  same container as the page content rather than in a floating pill of its own —
  a centred pill sets its own margins and visibly ignores the grid.
- **No decorative column overlay.** Hairlines are boundaries, never an overlay:
  where a rule appears, content sits inside it with its own padding
  (`.nx-ruled`). A line drawn across the middle of a paragraph is not structure,
  it is noise on top of content, and it measurably hurts reading.
- **Leading is set by role.** Display type runs 1.02–1.05 with tight tracking;
  body copy runs 1.45–1.55. Using a heading leading on multi-line body copy is
  what makes a layout look cramped.
- Section rhythm is 96px desktop / 48px below 900px, with the three-level
  spacing hierarchy (section → block → element) held throughout.

## Motion

**Lenis smooth scroll** (MIT, vendored at `assets/js/vendor/lenis.min.js`)
interpolates the scroll position rather than jumping to it. It is the single
largest contributor to how expensive a page of this kind feels. It is disabled
entirely under `prefers-reduced-motion`, since smoothed scrolling overrides the
operating system's own scroll physics — exactly what that preference asks us not
to do.

Everything else is entrances only, driven by one `IntersectionObserver`:

- Hero headline rises line by line out of an overflow mask.
- Blocks fade and lift 18px with a 60–90ms stagger.
- Section connector rules and the readout meters draw in with `scaleX`.
- The figures count up once, on entry.
- The navbar shortens from 80px to 64px past 24px of scroll and picks up an ink
  background and a hairline base, with a scroll-progress line above it.

Nothing runs longer than `--inx-duration-slow` (360ms) and nothing bounces —
verified: the only transition durations present on the page are 120ms, 200ms and
360ms. Under `prefers-reduced-motion` everything is visible immediately and the
marquee stops. With JavaScript disabled the page is complete and readable.

## Design-system compliance

Checked in a real browser rather than by eye:

- **Colour** — every painted colour (text, background, border, outline) resolves
  to one of the six approved brand colours or the derived ramp. No unapproved
  hue anywhere.
- **Type** — Manrope only, and only weights 400 and 600 are present. The browser
  default of bold 700 on headings is explicitly reset in `site.css`.
- **No gradients** on any surface, per the colour misuse page. The one
  `linear-gradient` in the file is an alpha mask on the marquee edges and
  introduces no colour.
- **Status colours are absent.** The guide restricts them to product UI and
  rules them out of marketing layouts, so the page carries none.
- **Elevation is borders-first.** Cards change border and surface on hover and
  never lift; the only shadow is under the condensed navbar, a genuinely
  floating layer.
- **Numbers are used only where content is sequential** — the process stages and
  the accordion. The four services are a set, so they are not numbered.
- **Accessibility** — one `h1`, ordered headings, every control and SVG labelled,
  no duplicate IDs, visible focus rings retained everywhere, skip link, the wide
  table scrolls in its own focusable box, and no horizontal page overflow at
  1440 / 1280 / 1024 / 768 / 390px.

## Two notes on the source

1. **A CSS bug in the style guide, fixed here.** In the original
   `inexastyleguidestandalone.html`, the `[EXTENSION] Functional status colours`
   comment closes early and leaves five lines of prose loose in the stylesheet,
   followed by a stray `*/`. Browsers error-recover, but it can swallow the
   declarations that follow. Corrected in `assets/css/inexa-tokens.css` — worth
   applying to the style guide itself.
2. **The token and component layers are otherwise verbatim.** Nothing was
   edited, so the guide stays the single source of truth. All new work lives in
   `site.css` under the `nx-` prefix and resolves to tokens.

## Placeholder content — read before publishing

The layout is production-ready. Several sections are **not**, because they make
claims that only iNexa can stand behind:

- **Pricing (§11).** £12,000 and £9,500/month are invented to demonstrate the
  tier structure. The page carries a visible "figures are illustrative" note;
  replace both before anyone sees this outside the studio.
- **Testimonials (§2, §10) and the featured engagement (§6).** Quotes and
  figures are written, not collected. They are attributed by role and company
  profile rather than to named individuals, deliberately — no invented person
  appears anywhere on the page. Replace with real, permissioned quotes.
- **Systems (§8).** The named products are examples of what an operations
  partner typically integrates. They are third-party trademarks and imply a
  working capability iNexa must actually have. Confirm the list, and note that
  naming a product is not a claim of partnership or certification.
- **Statistics (§2, §5)** — 40+ engagements, 96% retention, 26-month average,
  and the before/after averages — are illustrative.
- **Insights (§12)** article titles and dates are placeholders.

No third-party logos are reproduced anywhere; the systems section is a ruled
table of names rather than a logo wall, which keeps the page clear of other
companies' marks.

The brand lines — the positioning line in the hero, the promise in §14, the four
service names — come from the brand manual and should not be rewritten.

## Hosting

For production, swap the two data URIs in `assets/css/fonts.css` back to
`url('../fonts/manrope-latin.woff2')` so the fonts cache separately from the
stylesheet. They are inlined here so the mockup survives being opened directly
from disk, where browsers refuse to fetch a font over `file://`.
