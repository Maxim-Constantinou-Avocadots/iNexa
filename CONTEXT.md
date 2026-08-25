# Project context — iNexa marketing site

**A handoff document.** Everything a new session needs to keep working on this
build without re-deriving it. Written 2026-08-25, current as of commit
`88d8978`.

`README.md` describes what the site *is*. This file describes **why it is that
way, what was tried and rejected, and what is still open** — the part that is
expensive to rediscover.

---

## 1. What this is

A marketing-website mockup for **iNexa**, an operations-management
consultancy, built by Avocadots Design Studio.

- **Live:** https://maxim-constantinou-avocadots.github.io/iNexa/
- **Style guide:** https://maxim-constantinou-avocadots.github.io/iNexa/style-guide/
- **Previous version (frozen):** https://maxim-constantinou-avocadots.github.io/iNexa/previous/
- **Branch:** `claude/inexa-premium-homepage-is2zrg` — all work goes here.
  Deploys automatically on push via `.github/workflows/deploy-pages.yml`
  (~40–60s, then Pages serves the new bytes).
- No build step, no framework, no runtime network dependency. The typeface is
  embedded as a data URI, so the page renders identically from disk, from a
  static host, or in an embedded preview.

### The three source documents

Source-of-truth order, which the build spec itself defines. **When they
conflict, the design system wins, then the spec.**

1. **iNexa Design System v1.0** — the style guide the client generated. Ships
   at `style-guide/index.html`; its token and component layers are extracted
   verbatim into `assets/css/inexa-tokens.css` and `inexa-components.css`.
2. **iNexa Marketing Website — Design and Build Specification** (the "design
   MD", 2032 lines) — section-by-section build direction.
3. **Brand Guidelines v1.0** (50pp PDF) — photography, atmosphere, applications.

> ⚠️ **None of the three source documents are in this repo.** They were
> uploaded to the chat. If you need to check a specific rule, ask the client to
> re-attach them. The style guide is the exception — it is committed.

### The reference site

`https://oma-operator.framer.website/` — the client's example of the feel they
want. Its real CSS was downloaded and measured rather than eyeballed:

| Measured | Value |
|---|---|
| Container | 1199px |
| Text measure | 809px |
| Body leading | 140% |
| Tracking | −0.02 to −0.06em |
| Dominant weight | 500 (on 191 elements) |
| Accent | `#0EEB8F`, 28 uses only |
| Hairline | `rgba(255,255,255,0.05)`, 880 uses |
| Visual grid scaffolding | **none** |

**The client's instruction was: keep the iNexa brand, match everything
structural.** So iNexa's palette and Manrope stay; the reference's *structure*
— rails, hatch separators, hairline density, section rhythm — is what was
adopted. Note the weight-500 and green-accent findings are things we
deliberately did **not** copy: both are forbidden by the iNexa brand.

---

## 2. Brand constraints — non-negotiable

These are the rules that make or break the work. Every one has caused a real
correction at some point in this build.

**Typography**
- **Manrope only. Weights 400 and 600 only.** Never 300/500/700/800/900. The
  font is declared `font-weight: 400 600` (variable), so a stray 700 silently
  clamps to 600 — it will not look wrong, it will just be wrong. `tools/audit.js`
  catches it.
- Body copy is 18px. Leading 1.45–1.55 by role. **Never use the heading
  leading value (1.3) on multi-line body copy** — that is exactly what made the
  first build look "crammed" to the client.
- Sentence case headlines throughout.
- One eyebrow per section. One text colour per headline block.

**Colour**
- Six approved colours only: `#070B14` Ink Black, `#141D2B` Ink Navy,
  `#5E738A` Blue Slate, `#B8D0E5` Pale Sky, `#F5F7FA` Platinum, `#FFFFFF`
  White — plus the design system's derived neutral ramp.
- **No green accents.** (The reference site's `#0EEB8F` is not ours.)
- **Functional status colours** (success/warning/error) may appear *only*
  inside interface mockups, always beside a written label — never as
  decorative marketing colour. Currently 21 status-variant pills, and all 21
  sit inside `.nx-ui` / `.nx-mini` / `.nx-dash` interface panels — verified
  structurally, not by eye.

**Components**
- **Sharp corners — every corner radius is 0**, in the design system itself.
  Supersedes the original pill buttons and rounded cards, by client direction.
  The only round shapes left are the spinner ring and the radio input. See §5.
- Borders before shadows. Motion under 400ms.
- **Services are never numbered** — they are a set. **Process steps are
  numbered** — they are a real sequence.

**Content integrity** (build spec §22.13–14)
- **Never invent client logos, testimonials, metrics, or case-study results.**
  This has been caught twice mid-build. Placeholders must be visibly marked.

---

## 3. The gradient question — settled, but the guidelines still contradict

Brand Guidelines p28 lists **"Do not use gradients"**. But the manual's own
artwork uses an ink-to-blue atmosphere on pp1, 4, 13, 22, 29, 34, 40, 45, 49,
50 and behind the billboard on p47.

**Resolution:** read p28 as governing colour *application* — nothing here puts
a gradient on type, a button, a card, a table, a form control or the logo. The
atmosphere is a *background treatment*. The client then explicitly asked for
more gradients, which settles it in practice.

**Still open:** the guidelines document should be amended so the misuse page
stops contradicting the applications section. Flag this to the brand owner.

---

## 4. File map

```
index.html                  The homepage — 1074 lines, 14 sections
CONTEXT.md                  This file
README.md                   What the site is, and the placeholder register
style-guide/index.html      The design system document (deployed)
previous/                   Frozen snapshot of commit 9bee4d6, for comparison
assets/
  css/
    fonts.css               Manrope, self-hosted, inlined as data URIs (54KB)
    inexa-tokens.css        Token layer — verbatim from the style guide
    inexa-components.css    Component layer — verbatim from the style guide
    site.css                Marketing layer, nx- prefix — 2011 lines
  js/
    site.js                 Progressive enhancement only — 417 lines
    vendor/lenis.min.js     Lenis 1.3.19, MIT, 17KB
  img/                      leadership 146KB · collaboration 99KB · operations 108KB
  fonts/*.woff2             Raw font files, for production hosting
tools/                      Verification harness — see §7. Not part of the site.
.github/workflows/deploy-pages.yml
```

**Layer discipline:** `inexa-tokens.css` and `inexa-components.css` are
*extracted from the style guide and must stay that way*. Site-specific styling
goes in `site.css` under the `nx-` prefix. If you need to change a component,
change it in `site.css` as an override, or change the style guide and re-extract
— do not quietly edit the extracted layers.

### Page sequence (14 sections)

Hero (`#top`) · Why iNexa (`#trust`) · Operational challenge (`#challenge`) ·
Services (`#services`) · Operational transformation (`#transformation`) ·
How we work (`#how-we-work`) · Case study (`#case-study`) ·
Industries (`#industries`) · Systems view (`#systems`) ·
Client experience (`#client-experience`) · Engagement model (`#pricing`) ·
Insights (`#insights`) · Questions (`#questions`) · CTA (`#contact`) · Footer.

Each section is preceded by a separator band — a dot field since the
client asked for dots over the original diagonal hatch. The class is still
`.nx-hatch` in all 13 places. **One CTA phrase throughout:
"Book a strategy call".**

### `site.css` landmarks

| Line ≈ | Block |
|---|---|
| 13 | Corners — points at the token layer, no override here |
| 22 | Page frame, base type |
| 75 | Section rhythm (96px desktop / 48px below 900) |
| 98 | Grid — 12 col, 24px gap |
| 171 | Navigation |
| 302 | Hero (original left/right layout rules) |
| 361 | `.nx-ui` operational interface |
| 468 | Services rail / accordion |
| 631 | Process steps |
| 928 | **Page frame — rails and hatch bands** |
| 1189 | **Brand atmosphere, photography, icons** |
| 1207 | Atmosphere gradient tokens |
| 1372 | **Hero — centred stack** |
| 1393 | **Operational dashboard** |
| 1630 | **The plot — SVG path, HTML everything else** |
| 1897+ | Responsive + height-aware compaction |

---

## 5. Decisions and their reasons

Each of these was a real correction. Reversing one without knowing why it
exists will reintroduce a bug the client already complained about.

**The page frame.** Rails are continuous vertical rules at the container
edges; every section carries its own pair via `.nx-rail`, so the border token
re-points automatically on ink surfaces while all pairs sit at the same x.
Header, footer and drawer use `.nx-rail--quiet` — same inset, no rules, **plus
1px to compensate for the rail's own border**. That +1px is why every content
edge measures 129px rather than 128.

**No grid overlay.** The first build drew a 12-column hairline overlay *on top
of* content. The client's exact words: "the grid in the back clashes with the
text and makes it super hard to read." Removed entirely. Rules are now
boundaries that content sits *inside* with padding — never lines crossing text.
**Do not reintroduce a decorative grid overlay.**

**The navbar follows the grid.** It was a floating centred pill; the client
called that out. Now a full-width bar whose content sits in the same container
as everything else.

**Atmosphere is CSS, not a raster.** `atmosphere.jpg` was deleted. The client
said the gradient "looks like an image instead of a color gradient and it is a
bit blurry" — because it *was* an image. It is now four layered
`radial-gradient` sets (`--nx-atmos-hero`, `--nx-atmos-cta`, `--nx-atmos-band`,
`--nx-atmos-light`) drawn only from approved colours. Resolution-independent
and free to download.

**Separators are dots, not lines.** The bands between sections were a diagonal
hatch — three 1px rules per 8px tile — and are now two dots per 8px tile on
opposite diagonals. A single centred dot read as a sparse grid at this band
height; a full grid read as noise. The dots stay round: a dot has no corners,
so this is not the case the zeroed corner scale governs. Both variants keep
their ramp colours (`n-100` light, `n-800` ink), so the palette check is
unaffected. The class name `.nx-hatch` was left alone rather than renaming 13
elements in the markup for a texture change.

**No signifier watermark.** The enlarged mark from the ID cards (p49) was tried
behind the atmosphere sections and removed at the client's request: the cards
have no page frame, but this site does, and the mark's diagonals crossed the
rails and hatch bands at arbitrary angles. Two structural systems competing for
one space reads as noise. The signifier keeps the header lockup and the
dashboard chrome mark. *Side benefit: that pseudo-element was also the cause of
horizontal overflow at ≥1024px and needed its own overflow containment.*

**No rule on a centred eyebrow.** `.inx-eyebrow--rule` draws an opening dash.
The eyebrow is a flex row, so centring it centres *rule + text as a group*,
pushing the words right of the page axis. It stays on the left-aligned
eyebrows (drawer "Menu", CTA); it must not go back on the hero.

**Sharp corners everywhere — a design-system change, not a site override.**
The client asked for no rounded corners at all. The first attempt re-pointed the
scale to 0 in `site.css` only; that left the style guide — which carries its own
inline copy of the CSS and does not link the extracted files — still drawing
pills. The change now lives at source: `--inx-radius-sm/md/lg/xl/pill` are all
`0` in `inexa-tokens.css`, the five component circles that were rounded
rectangles are squared in `inexa-components.css` (icon-only button, status pill
dot, tag remove, switch knob, logo bug), and the style guide's inline block was
regenerated from both files.

`--inx-radius-full` survives at 50% in exactly two places, and it is not a
corner — it draws a circle where the circle IS the meaning: the button loading
spinner, a rotating ring, and the radio input, whose round shape is what
separates it from a checkbox. **Never use it to round a rectangle.**

The `nx-` layer's own curves are squared in `site.css`: the feed dot and the
hardcoded `2px` on the chart bars.

Verified in the browser at 1440×900 with hidden panels forced visible, on both
pages: the homepage paints no non-zero radius anywhere; the style guide paints
three, and all three are the intended circles — two radio inputs, the spinner
ring, and the swatch that documents `radius-full` itself.

**Note the sync invariant:** `style-guide/index.html` lines 12–1126 are
`inexa-tokens.css` + `inexa-components.css` concatenated byte-for-byte, under
two marker comments. Change the files, then regenerate the block — never edit
one side alone.

**Hero is a centred stack with the dashboard beneath** — client's explicit
structure request.

**The operational dashboard is a real chart, not a decoration.** The draft was
twelve flex-boxed `<i>` bars with no axis, no grid and no hover. It now carries
a KPI strip with a named comparison on each figure, a plotted 12-week series,
the business-areas table and an integration-health column.

Two rules govern its data colour, and both come from the brand rather than from
taste. **One sequential hue** — Pale Sky over Blue Slate — because there is one
series and identity is not in question; there is no categorical palette here and
none should be introduced. **The status palette is reserved for state** and
always ships beside a written word ("On track", "Needs owner", "Synced"), so
colour never carries meaning alone.

*Meters only where the figure is genuinely part-to-whole.* The draft put a
progress meter under "Reporting cycle · Daily", which encodes nothing. Only
"214 / 220" keeps one; the other tiles carry a named delta instead.

**The plot is SVG for the data path and HTML for everything else** — grid,
axis labels, markers, tooltip. The panel is only ~478px wide inside the 1000px
hero stack, so a viewBox scaled to fit rendered axis text at 5px. Scaling the
plot must not scale the typography. The line holds a true 2px via
`vector-effect="non-scaling-stroke"`; no circle is drawn in SVG, so
`preserveAspectRatio="none"` distorts nothing. Three traps, all hit once:
`hidden` is not honoured on SVG children, `SVGElement` has no `.hidden`
property, and a unitless `--nx-x` is invalid in a length context — each
silently puts a mark at the origin instead of erroring.

**The dashboard sheds detail as the viewport shortens.** Each step removes a
*second encoding* of something already stated, never information:

| Breakpoint | Dropped | Why it costs nothing |
|---|---|---|
| ≤1023px wide | Side rail | Nothing it lists is a control |
| ≤1023px wide | The plot; panel goes flat | The figure beside it says "412 → 132 per week" |
| ≤1023px wide | Aside activity list | Integration health already carries system state |
| ≤820px tall | The plot, and the aside's activity list | As above |
| ≤768px tall | Nothing — density only | Frame padding and block gaps carry no information |
| ≤767px wide | Aside + table | Both repeated in full further down the page |
| ≤720px tall | Figure meters, panel heading | They restate what is written beside them |
| ≤400px wide | Chrome status pill | Wraps to a second line |

**The body is a grid, so its row height is the tallest COLUMN.** Trimming the
main column alone changes nothing while the aside still runs long — that is
why the aside's activity list is the first thing to go at short heights. This
cost an hour the first time; check `.nx-dash__aside` before touching anything
else when `herofit.js` fails.

The headline and lead are **not** levers — the headline must stay in its token
range, the lead must keep body leading.

**Amendments to the build spec, approved by the client** (the MD's motion list
does not cover these; they should be added to it):
1. **Lenis smooth scroll** — the single largest contributor to the premium
   feel. Off entirely under `prefers-reduced-motion`.
2. **Number counters** on the Why iNexa figures, with a visible "sample
   figures" caption.
3. **Pricing section retained** — the MD advises against it for a consultancy;
   kept by client decision, figures marked illustrative on the page.

Dropped as the MD requires: the marquee (continuous decorative movement).

---

## 6. Bugs found and fixed — do not reintroduce

| Bug | Cause | Fix |
|---|---|---|
| Success pill dot invisible | Style guide's status-colour comment closed early, costing exactly one declaration — `--inx-status-success` was never defined | Repaired in `inexa-tokens.css` *and* `style-guide/index.html` |
| Fonts not loading | Google Fonts blocked; browsers refuse to fetch fonts over `file://` | Inlined as data URIs in `fonts.css` |
| Logo occupying 300px while rendering at 94px | Outer `<svg>` had no `viewBox` (it lives on `<symbol>`), so it fell back to the SVG spec's 300px default | `viewBox` on the outer element too |
| Descenders clipped in the masked line reveal | Overflow mask cut the glyph box | `padding-block-end: .14em; margin-block-end: -.14em` |
| Three competing left edges (80 / 104 / 129) | `.nx-rail--quiet` didn't account for the rail's own border | +1px; all now 129 |
| Horizontal overflow ≥1024px | `.nx-atmos::after` inset past the edge; `body{overflow-x:hidden}` was masking it | Pseudo-element now gone entirely |
| Screenshot harness scrolled nowhere | Lenis intercepts `window.scrollTo` | Harness pages use `reducedMotion: 'reduce'`, which disables Lenis |
| Invented client name in the dashboard | "Northgate Group" — a fabricated client | Changed to "Distribution client" |
| Chart label contradicted its own bars | Bars descend, so they plot touchpoints *remaining*, but the label said "removed" | Label corrected |

---

## 7. The verification harness (`tools/`)

**This is the most valuable thing to keep.** Claims about this build were
measured in a real browser, not asserted. Preserve that habit — the client
notices unverified claims.

```bash
cd tools
npm install                                   # playwright only
export CHROME_PATH=/path/to/chromium          # optional; see tools/env.js
npm run all
```

`tools/env.js` reads two env vars: `CHROME_PATH` (leave unset to use
Playwright's own download) and `PAGE_URL` (defaults to the local `index.html`;
point it at the deployed URL to verify a release).

| Script | Checks |
|---|---|
| `overflow.js` | JS errors and horizontal overflow at 390 / 768 / 1024 / 1280 / 1440 |
| `palette.js` | **Every painted colour** against the approved list + derived ramp |
| `audit.js` | Font weights, motion durations, single `h1`, heading order, labels, duplicate IDs |
| `navfit.js` | Nav and page overflow at ten widths, 1440 → 390 |
| `align.js` | Rail lines all at one x, content edges all at one x, hero text centred on the page axis |
| `behaviour.js` | Tabs, FAQ accordion, image loading, Lenis, counters |
| `herofit.js` | Hero height vs viewport across 13 viewports — the next section must be reachable within **1.4 screens** |

### Current measured state (commit `88d8978`)

- Palette: **PASS** — every painted colour approved.
- Weights: **only 400 and 600.**
- Durations: only the three motion tokens (120 / 200 / 360ms).
- One `h1`, ordered headings, no duplicate IDs, `svgNoRole: 0`.
- No JS errors, no horizontal overflow at any width; nav fits at all ten.
- Rails all at 80px, content edges all at 129px, hero text centred to within
  0.01px of the page axis at 1440.
- Hero fit — **all 13 viewports within 1.4 screens:**

```
1920x1080 1.11   1600x900 1.25   1440x900 1.25   1440x800 1.22
1366x768  1.27   1280x720 1.34   1024x768 1.35    820x1180 1.10
 768x1024 1.26    430x932 1.04    390x844 1.23     390x667 1.34
 360x640  1.40
```

- Contrast: Pale Sky never below **10.64:1** over the gradient (sampled from
  rendered pixels, not computed against a nominal background).

### Gotchas when running it

- **Always pass `reducedMotion: 'reduce'`** on any page that needs
  `window.scrollTo` — Lenis owns the scroll otherwise.
- Playwright **cannot reach the deployed URL from this container** — the agent
  proxy resets browser connections. Verify deploys by comparing served bytes
  instead:
  ```bash
  curl -s https://maxim-constantinou-avocadots.github.io/iNexa/index.html | md5sum
  md5sum index.html
  ```
- `behaviour.js` reports the two below-fold images as `loaded: false`. That is
  correct — they are `loading="lazy"`.

---

## 8. Open items

**Content — blocking a real launch.** Every one of these is a marked
placeholder, and the build spec forbids inventing replacements:

- Case study: "Sample engagement" pill, outcomes labelled "sample figures",
  quotation captioned as a sample. **Needs a verified, permissioned story.**
- Client experience quotations: marked as samples in the lead and in each
  attribution.
- Why iNexa counter figures: captioned "sample figures".
- Pricing: **£12,000 and £9,500 are illustrative** and say so on the page.
- Hero and systems interfaces: labelled "Sample".
- Footer legal links (Privacy, Cookie, Terms) point nowhere. Those pages, plus
  About and Insights, are in the spec's architecture but outside this scope —
  which is why they are absent from the header.

**For the brand owner.**
1. The gradient contradiction (§3) should be written into the guidelines.
2. The corner scale is now 0 in the design system itself, and the style guide
   documents it (§5). The client's master copy of the design system still
   specifies pill buttons and rounded cards — this repo's copy has diverged
   from it deliberately, and the master should be brought in line.
3. Lenis, counters and the retained pricing section should be added to the
   build spec's approved list.
4. The style guide's status-colour comment bug is fixed in this repo's copy —
   the client's master document still has it.

**Housekeeping.**
- `previous/` is a frozen snapshot kept only for side-by-side comparison. It is
  not maintained and **should be deleted once a direction is settled.**
- The client has been shown both versions and prefers this one, so deleting
  `previous/` is probably safe to propose.

---

## 9. Working agreements

- **Develop on `claude/inexa-premium-homepage-is2zrg`.** Never push elsewhere
  without asking. `git push -u origin claude/inexa-premium-homepage-is2zrg`.
- **Do not open a PR unless the client asks.**
- Measure before claiming. If something wasn't verified, say so.
- The client gives short, direct visual feedback ("it looks messy", "too text
  heavy"). It has been accurate every time, and there has usually been a
  concrete structural cause worth finding rather than a taste difference worth
  debating.
