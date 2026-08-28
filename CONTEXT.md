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
index.html                  The homepage — 1138 lines, 14 sections
about/index.html            The About page — thesis, principles, operating layer
services/index.html         The services index — the client's four service lines
industries/index.html       The industries page — the client's three industries
case-studies/index.html     The case studies index — AGD Global and CyDrive.eu
case-study/index.html       The case study detail page
contact/index.html          The contact page — the site's only form
faq/index.html              The FAQ page — 6 topics, 25 answers, tabbed
CONTEXT.md                  This file
README.md                   What the site is, and the placeholder register
style-guide/index.html      The design system document (deployed)
previous/                   Frozen snapshot of commit 9bee4d6, for comparison
assets/
  css/
    fonts.css               Manrope, self-hosted, inlined as data URIs (54KB)
    inexa-tokens.css        Token layer — verbatim from the style guide
    inexa-components.css    Component layer — verbatim from the style guide
    site.css                Marketing layer, nx- prefix — 3135 lines
  js/
    site.js                 Progressive enhancement only — 501 lines
    vendor/lenis.min.js     Lenis 1.3.19, MIT, 17KB
  img/                      leadership 146KB · collaboration 99KB · operations 108KB
  fonts/*.woff2             Raw font files, for production hosting
tools/                      Verification harness — see §7. Not part of the site.
  stamp.js                  Cache-bust stamper. Run before committing assets.
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
| 576 | **Transformation panel** (was the compare table) |
| 754 | Process steps |
| 928 | **Page frame — rails and hatch bands** |
| 1189 | **Brand atmosphere, photography, icons** |
| 1207 | Atmosphere gradient tokens |
| 1372 | **Hero — centred stack** |
| 1393 | **Operational dashboard** |
| 1630 | **The plot — SVG path, HTML everything else** |
| 1897+ | Responsive + height-aware compaction |
| 2200+ | Case study feature · sectors · integration map |
| 2600+ | Contact page · FAQ tablist |
| 2915+ | **About — thesis, principles ledger, operating-layer stack, vision** |
| 3130+ | **Services — the four panels, and their homepage cells** |
| 3300+ | **Industries — the editorial index of three** |
| 3450+ | **Case studies — the brief's own card treatment, plus the write-ups** |

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

**The transformation section is a panel, not a table.** It began as a
three-column `<table>` — Area / Before / With — with a header row and a rule
under every row. The client read it as a spreadsheet, and the cause was
structural: six rows of equal weight with horizontal rules doing all the work.

The first replacement was a spine — two columns either side of one continuous
vertical rule. It killed the spreadsheet read but the client's verdict was
"not premium, not high tech", and that was right: it had **no surfaces**.
Everything floated on bare ink with a lot of air, which reads sparse rather
than engineered.

It is now `.nx-shift-panel`: six cells hairline-gapped into one block, built
exactly the way the hero dashboard's KPI strip is built — `gap: 1px` over a
border-coloured ground, so the hairlines ARE the gaps rather than drawn rules.
That construction is what makes the dashboard read as an instrument, and it is
the most product-like idiom in the system; reuse it when a section needs to
feel like a tool rather than a document.

Inside each cell the two states stack, linked by a connector that runs between
the two markers only — never alongside the type, or it reads as a stray tick.
The state being left behind carries a **hollow** marker, the state gained a
solid accent one, so the pair reads without relying on colour alone; the panel
header states the key once. Hover lights a 2px accent edge along the top of the
cell and lifts its surface to `n-900`.

Lesson worth keeping: on this brand "premium" has meant *surface and density*,
not restraint. The sparse editorial version was the more tasteful drawing and
the wrong answer.

**The case study is a feature panel plus a real page.** The homepage section
stacked six full-width cells — intro, meta, prose, KPIs, a photo AND a sample
report table, then a quote — and ran to **1877px, the tallest section on the
page by 650px**. Two of those cells were restatements: the operational table
appears twice more (hero dashboard, systems section), and the
challenge/approach prose is detail-page material, not shop window.

The homepage now carries one feature panel — photo bleeding down the left, the
claim and its proof on the right, outcomes as a hairline-gapped strip across
the full width, and a button through to the study. **1065px, down 43%.**

`case-study/index.html` is the destination, and the first real sub-page in the
build. It reuses the homepage's sprite, header and footer verbatim so they
cannot drift, and links `../assets/css/*` — no duplicated CSS.

Three traps when adding another sub-page:
1. Rewriting `href="#..."` to `href="../index.html#..."` also hits
   `<use href="#inx-lockup">` inside the header — which silently breaks the
   logo. Rewrite anchors only.
2. `site.js` fed nav hrefs straight to `querySelector`, which throws on
   `../index.html#services`. `initSectionTracking` now takes the fragment and
   only when the href is a bare one; without that the whole script dies and
   every reveal stays invisible.
3. `.inx-eyebrow` is `inline-flex`, so an `inline-flex` element above it
   shares its line.

**`<strong>` defaults to weight 700.** The variable font is declared
`400 600`, so a stray 700 clamps to 600 and looks correct while being wrong.
The dashboard's activity list shipped with three of them for several commits.
`tools/audit.js` reports it in `fontWeights` — read that field, not just the
PASS lines.

**Industries: cells need a surface of their own.** The client called this one
"cheap, no design whatsoever", and there were two structural causes.

First, **the cells were the same colour as the section behind them.** The
section grounds on `--inx-bg-sunken` (Platinum) and `.nx-cells > *` paints
`--inx-bg` — also Platinum. Eight objects therefore read as a faint grid of
lines rather than as cards. They now sit on `--inx-bg-raised`. **Check this
first whenever a cell grid looks flat: compare the cell background against the
section's.**

Second, every cell carried the word "SECTOR" above a sector name — eight
repetitions of a label carrying no information, and no support at all for the
headline's claim. Each cell now names the operational failure specific to that
sector, so the section argues rather than lists, and carries an icon well that
inverts to solid ink on hover.

Cost: 597px → 832px. Worth it — the section previously said nothing.
Not numbered: these are a set, not a sequence (§2).

**Systems integration is a diagram, not tables.** It was two tabs of plain
tables inside the same `.nx-ui` chrome the hero dashboard uses — the third
table-shaped panel on the page, with half its content hidden behind a tab.
Client: "super simple and boring."

Systems integration is the most diagrammatic subject on the site: four sources
feeding one view. It is drawn as that now — source nodes on the left, each
with a spoke into a vertical bus, a stub across to an **ink** hub card so the
destination reads as a destination rather than a fifth peer. The spokes draw
right and the spine draws down on reveal, one pass, no loop.

The two tables described the same four systems from different angles (what
they exchange / who owns the information), so both fold into one always-visible
node. **The tabs are gone and nothing is hidden.** `behaviour.js` no longer
clicks `#sys-t2`; it asserts the map draws instead. `initTabs` in `site.js`
now has no consumer — kept, and labelled as such, because `.inx-tabs` is a
documented design-system component.

**Simplified on a second pass** — "a bit too complex". The first version drew
a spoke off every node into a vertical bus and then a stub across to the hub:
three line systems doing the work of one. It is now a single connector from
the sources block to the hub, and each node's owner sits on the same line as
what it exchanges instead of in a second right-aligned column. Four rows, one
line, one destination.

Trap: nothing occupies the middle grid column, so the hub auto-placed into the
88px gutter and crushed to one word per line. **`grid-column: 3` on
`.nx-map__hub` is load-bearing.**

**The contact page fills a brief gap, and carries the site's only form.**
The brief specifies this page — title, intro, five fields, CTA — and the audit
found the site had **zero `<form>` and zero `<input>` elements**. It is built
from the design system's own form components (`.inx-field`, `.inx-input`,
`.inx-select`, `.inx-textarea`, `.inx-help`), which were fully specified in
the style guide and had never been used on a page.

Structure: an ink hero with a three-cell response strip (1 working day / 45
minutes / no cost), then a sticky ink "what happens next" panel beside a form
panel with chrome — the same panel family as the dashboard and the integration
map, so it reads as part of the instrument rather than a generic contact form.
The address block is the real one, from the brief's letterhead.

**Two things this fixed that were already broken.** The case study page had no
drawer at all — the earlier extraction stopped at `</header>`, so its mobile
menu button had `aria-controls="nav-drawer"` pointing at nothing and opened
nothing. And the header/drawer are duplicated across three pages now: a nav
change means editing all three. If a fourth page appears, that duplication is
the thing to fix first.

**The FAQ page is a tablist, and the hero is shared with contact.** The client
asked for "a multistate box where depending on the button we click that box
appears", so a reader never scrolls a wall of questions. That is a tablist —
and `.inx-tabs` / `initTabs` already existed: the systems section was its last
consumer before becoming a map, so this **reuses** the behaviour instead of
adding a second implementation. `initTabs` gained ArrowUp/ArrowDown, since
this rail runs vertically and that is the key a keyboard user reaches for; it
still handles Left/Right, so a horizontal strip works unchanged.

The hero is deliberately the *same construction* as the contact hero — ink
band, eyebrow, h1, lead, three-cell strip, all under `.nx-contact-hero`. The
two sub-page heroes share one class on purpose: change one and change both.

Two things worth knowing:
- `.nx-faq__stage` has `min-block-size: 520px`. Without it the box changes
  height as topics switch and throws the page around under the reader.
- The rail's separators are **borders on the buttons**, not the 1px-gap-over-a
  coloured-ground trick used elsewhere in the system. The rail is taller than
  its buttons, so that ground showed through as a solid blue block under the
  last topic.

**Nav:** the header CTA now points at `/contact/` rather than the homepage
anchor, which freed the nav slot that FAQ took. The bar stays at six items and
`navfit.js` passes at all ten widths on all five pages. Contact remains in the
drawer and the footer.

**The services are the client's, verbatim, and must stay that way.** The brief
names four service lines in §"WHAT WE DO" (pages 6–7). The site had been built
to a different set — Operations management / Workflow optimisation / Systems
integration / Strategic support — which dropped **Marketing & Growth Execution**
entirely and promoted "Workflow optimisation", a *bullet under Operations
Management*, to a service of its own. The client's instruction was explicit:
listed, not renamed, missing or altered. So the four are now:

| Service | Slug |
|---|---|
| Operations Management | `services/operations-management/` |
| Marketing & Growth Execution | `services/marketing-growth-execution/` |
| Technology & Platform Development | `services/technology-platform-development/` |
| Strategic Oversight | `services/strategic-oversight/` |

Names, descriptions and capability bullets are the client's own words on the
homepage, the services page and every footer. **Do not reword them, do not
re-case them to match the site's sentence case, and do not "fix" the em dash in
"platforms—transforming".** They are Title Case because they are proper service
names, not headings. The old status pills in the homepage cells ("Operating
rhythm — Weekly") were invented specifics and went with the rename; the
client's bullets replaced them.

**Shared boundaries are for reading; separate cards are for choosing.** This is
the rule the services page cost us, and it is worth keeping. The four were
built first on the hairline-gap idiom — 1px gaps over a border-coloured ground
— and the client's read was "one big card, a mess, users will not know where to
click". Correct on both counts. That idiom exists for a group of cells you read
as ONE THING: a dashboard, a spec table, the hero strip. Four services are four
things you CHOOSE BETWEEN, and a choice has to look separable and look
clickable. Applying a reading idiom to a choosing problem is what produced a
grey slab with a text link in the corner of each quarter.

The rebuilt card is: real gaps between cards; a tinted surface (`--inx-bg`)
against the white page so each has an edge; an ink icon tile; a one-word kicker
(Operations / Marketing / Technology / Strategy — the client's own shorthand,
brief page 15) so the four are scannable without reading names that all begin
the same way; and exactly one control per card, styled as a button. Hover
*lightens* the card to white with an ink border and fills the button — the card
comes forward off the page rather than receding into it, which matters because
there are no shadows in this system to do that job. The same component is used
on the homepage, so a service looks the same wherever it is offered.

Two smaller notes on it. The capability caption is a sentence, so it is set as
one — an earlier pass had it in tracked caps, which shouts and stops being
readable past about three words; tracked caps are for the two-word kicker only.
And because the cards are separate objects with their own background, fading
them on reveal is safe here, unlike the About ledger where the border ground
showed through.

**The services page, and the four pages that do not exist yet.** `services/`
lists the four as cards, two-up. Each card is one `<a>`, and each links to its
**dedicated service page, which has not been built**. Those four URLs 404 until
they are. That was the client's call, made knowingly. Everything else —
homepage cells, every footer Services column — points at `services/#<slug>`
anchors instead, so the broken links are confined to the four cards where they
were asked for. When the detail pages land, only those four hrefs change.

Two other things moved with it. The nav's "Services" item now goes to
`services/` rather than the homepage anchor; `navfit.js` still passes at all ten
widths on all six pages. And the old services rail — `.nx-svc__tab` /
`.nx-svc__panel` under `[data-svc]`, plus its `initServices` JS partner — was
deleted. Nothing had used it since the services section became a cell grid, and
its `.nx-svc` / `.nx-svc__desc` / `.nx-svc__list` names would have collided
silently with the new page's.

**Still missing from the brief, and blocking the four detail pages.** The brief
gives ~65 words per service. That is enough for a card, not for a page. Nobody
has supplied scope, what is in and out, how an engagement runs, who it is for,
or a proof point. Also: Technology & Platform Development has only **three**
bullets where the others have four, and none of them is platform development,
despite that being the service's name. Ask before inventing any of it (§22.13–14).

**The case studies page is the one place the brief actually specified a
design, so it is built to that spec.** §"CASE STUDIES" (page 8) gives the title
*Real Execution. Real Results.* and two engagements in full; the visual mockup
section (page 19) then specifies the treatment outright:

> 2 large cards side by side · background image (dark overlay) · white text on
> top · hover: image zooms slightly, overlay darkens, CTA appears ("View Case")

All four behaviours are implemented and measured. Two departures, both
deliberate: corners stay sharp (the design system's radius scale is 0, §5), and
the CTA is hidden-until-hover only inside `@media (hover: hover)` — on a touch
screen a control that exists only on hover is a control that never exists, so
there it is always visible; keyboard users get it on `:focus-visible`.

The scrim is a flat `rgba(7, 11, 20, .74)`, not a gradient — the system has no
decorative gradients outside the approved atmosphere tokens. Checked against the
worst case, a pure-white pixel under the scrim: white text 8.87:1, the n-200
subtitle 5.58:1. Both clear AA. It darkens to .88 on hover.

**AGD Global Pty Ltd and CyDrive.eu are named because the client named them.**
Earlier notes in this file flagged naming these businesses as pending client
permission — that flag was wrong for this page and is now cleared. The brief is
the client's own document, and its case studies section names both, describes
each engagement, and gives Challenge / Solution / Result for each. Using their
words about their own work is exactly what was asked. (The About operating-layer
diagram is a different matter — those generic labels were our construct, not
theirs, and still are.)

Below the two cards, each engagement gets its full write-up as **one object**.
The first version floated a Scope box top-right and put Challenge / Solution /
Result in a separate row below it — two white orphans on a pale band with a gap
between them and nothing joining them. Everything now lives in a single
bordered panel: an ink band carrying the name (which ties the write-up back to
the dark card above, so the two read as the same object continued), the intro
and scope beneath it divided by a rule rather than a second box, and
Challenge / Solution / Result across the panel's tinted foot with shared 1px
boundaries (§3.3 — a group to read together, unlike the service cards, which
are choices and so are separated). The cards link to those write-ups by anchor,
so nothing 404s.

The section behind them went from sunken back to white when the panels gained
their own surface — a tinted band under tinted panels was one layer too many.

**Nav:** "Case study" became "Case studies" and points at the new page rather
than the homepage anchor, on all eight pages. `navfit.js` still passes at all
ten widths.

**The industries page is one page listing three — because that is all the brief
asks for.** §"INDUSTRIES PAGE" (page 9) gives a title and three industries with
one line each. Checked three ways before building: the brief's only page-level
headings are ABOUT PAGE, INDUSTRIES PAGE and CONTACT PAGE; the industries block
contains no sub-page spec, no link treatment and no per-industry copy; and the
visual-mockup section (pages 12–22) does not mock industries at all — the
navbar it specifies does not even include them. **There is no page per industry
and none should be built without the client asking.**

    Trading & Commodities · Digital Platforms & Marketplaces · Growth-Stage Businesses

**Three ink panels on a white page**, and it took four passes to get there.
There is almost no copy — three names and one line each — so the presence has
to come from the surface, not the text, and on this brand that has always meant
ink and density rather than air (§5, "premium has meant surface"). The first two
attempts set it on white with hairline rules and small outline icons; the
client's read was "half done, give it some life", and both times they were
right. A card grid was never an option either: three items at this content
weight is exactly the empty-template look the homepage sector strip was told off
for.

Ink **panels**, not an ink section: the page's hero is already an ink band, and
a second full-width dark section directly beneath would read as one long dark
region instead of three objects.

**The panel is built from the service card's parts**: a 44px solid icon tile
beside a one-word kicker, then the name, then the copy — the same anatomy,
inverted for the dark surface. That inversion is what makes the services and
industries pages read as one system rather than two designs, and it is the
answer to "make sure it all looks consistent".

Two graphic ideas were tried and dropped on the way. An oversized mark floated
behind the whole panel ran straight through the role chip and looked like an
accident. Replacing it with an 84px mark on its own plate fixed the collision
but introduced a graphic at a size nothing else on the site uses — "the huge
icon is unnecessary", and correct. The icon is back at 44px, the system's own
size, and the right-hand box carries only the role: capped at 280px and pushed
to the panel's right edge rather than stretched across its column, so it reads
as a small annotation instead of a second panel. `grid-auto-rows: 1fr` keeps
the three panels the same height however the copy wraps, which is most of what
"consistent" meant here.

The roles — *Full operational management / Built, launched and run / Structure
and reporting* — are the same three already on the About operating-layer
diagram, sourced from the brief's case studies. Unnumbered: a set, not a
sequence (§2).

An even earlier pass repeated the four service names under all three
industries, which triplicated one list down the page and read as filler. That
statement is now made **once**, in the band below the three.

**The homepage industries section still does NOT match the brief.** It lists
eight invented sectors (Professional services, Logistics & distribution,
Healthcare groups, Manufacturing, Financial services, Construction, Technology,
Multi-site retail). None is in the brief, and they read as claims about who
iNexa has worked with. The client's three are the ones on the new page, and they
agree with the Trust-section line and the About stack diagram. Replacing the
homepage eight was **not** in the scope of the request that built this page —
raise it before doing it.

**The About page is the brief's argument, not a team page.** The client asked
for something modern with "wow effects" and "no boring sections that look like
templates", and there is no staff roster, no founder photo and no headcount to
put on it — inventing any of those is barred by §22.13–14. So the page argues
instead: a thesis, what the company is, what it will not be talked out of, and
where it goes. Every line of copy comes from the brief.

Its sections, and why each is shaped that way:
- **Thesis** (`.nx-say`) — the one masked line-reveal on the page, four
  composed lines rising in sequence. The homepage's `.nx-line` could not be
  reused: that fires off `.is-ready`, set once at boot, so a statement in the
  middle of a page would be over before the reader reached it. `.nx-say` is
  driven by the scroll observer instead, at the **deep** threshold (below).
- **What we are** — photo bleed against copy, `.nx-about`, 5fr/7fr.
- **Four principles** (`.nx-prins`) — the brief's four messaging lines.
  Explicitly **not numbered** (a set, not a sequence, §2) and not a four-card
  grid. The first attempt was a plain hairline ledger and the client's read was
  "could have been designed better" — correctly: the heading left half the
  width empty above it and the rows were body text on rules, with the notes
  carrying no weight. Rebuilt as two things. The heading moved beside the list
  and **sticks** at 104px, so the section has no dead half and the claims run
  past a fixed title. The rows became **surfaces** — shared 1px boundaries over
  a border-coloured ground (§3.3), the dashboard's instrument idiom — each with
  a square marker that fills on hover and a rule that grows under the claim.
  The reveal animates each row's *contents*, never the row: fading the cell
  shows the ground through it as a solid blue block, which is how the FAQ rail
  broke.
- **The operating layer** (`.nx-stack`) — three businesses dropping into one
  shared layer. The drops scale from `scaleY(0)` after their box arrives, so
  the diagram assembles top-down. Labels are generic pending client sign-off
  on naming real businesses — see §8.
- **Vision** — the brief's closing statement, set large, with the site's
  standard CTA pair.

**`data-reveal="deep"`.** `initReveal` now runs two observers. The default one
stays generous — a section only has to peek in. Anything marked
`data-reveal="deep"` waits for threshold 0.35 and a `-35%` bottom margin. The
thesis needed it: the sub-page hero is only ~700px, so at 1440x900 the
statement is already 200px on screen at load and the whole sequence played
before the reader scrolled at all. A set-piece nobody sees begin is wasted.

**Two shared-component fixes went in alongside it**, because the About page
made them visible and they were wrong on every page: the footer's Company
column carried an inline `grid-column:span 2` that outranked both breakpoints
and left it at a sixth of the width on phones, and `.nx-span-2` was missing
from the grid scale entirely. About is now listed in that column on all five
pages. The case study's style-guide link was also resolving to
`case-study/style-guide`.

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
| About's thesis reveal already played on landing | The hero is ~700px, so the statement is partly on screen at load and the shared observer (threshold 0.1, `-10%` margin) fired immediately | Second observer, `data-reveal="deep"` — threshold 0.35, `-35%` margin |
| Composed line-break statement re-wrapped | `.nx-say` carried `max-inline-size: 18ch`, narrower than its own longest line, so one mask held two rows | Cap removed; the composed lines *are* the measure, and the clamp keeps them one row down to 360px |
| Footer's Company column ~1/6 width on phones | `style="grid-column:span 2"` inline on the column — inline styles outrank every media query, and `.nx-span-2` was never in the grid scale at all | `.nx-span-2` added to the scale and to both breakpoints; inline style deleted from all five pages |
| Case study's "Built on iNexa Design System" 404'd | Sub-page path rewrite missed the footer's `style-guide/` | `../style-guide/` |
| Industries page's footer pointed at ids that were not on it | Built from the services page, whose footer Services column uses same-page anchors (`#operations-management`); those came along and resolved to nothing | Repointed to `../services/#slug`; **when cloning a page, re-check every same-page anchor in what you copied** |
| Three stale service cards left behind in the markup | The replacement's end anchor was `'      </ul>'` (6 spaces), which is also a substring of the inner list's `'            </ul>'` (12 spaces), so `.index` stopped at the first inner list and only the first card was replaced | Cut the stale region and assert on a marker unique to it; **anchor block replacements on something that cannot appear nested inside the block** |
| Four homepage icons silently swapped | A bulk `#i-build`→`#i-nodes` / `#i-eye`→`#i-pulse` replace across the whole file, meant for the services cells, hit the challenge section, process step 03 and two industry tiles | Restored by line; **scope icon-id replacements to the section, never the file** |
| Cache-bust stamping never reached a single visitor | It ran in the deploy workflow, but Pages publishes the branch — the artifact the step edited is not what goes online | Stamping moved to commit time (`tools/stamp.js`); the workflow step now only *checks* |

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

- **Asset URLs are cache-busted at COMMIT time, and this matters.** GitHub
  Pages sends `cache-control: max-age=600` on HTML *and* CSS, and the two
  expire independently — so a visitor can be served **new markup with the
  previous stylesheet**, which renders any newly-added section completely
  unstyled. This bit the build twice.
  **`tools/stamp.js` writes a content hash of each asset into every HTML link
  to it. Run `npm run stamp` in `tools/` before committing any change to a
  `.css` or `.js` file, and after adding a page.** `npm run all` and the
  deploy both run `stamp.js --check`, which fails on a stale link.
  New asset links can be written `?v=0` — the stamper replaces whatever is
  there. It is idempotent, and skips `previous/`.
- **Pages publishes the BRANCH, not the workflow artifact — do not put a build
  step in the deploy and expect anyone to see it.** This was the previous
  design and it silently did nothing for weeks: the workflow rewrote `?v=dev`
  to the commit SHA, its own verification grep printed the stamped value, the
  artifact was uploaded with it, `deploy-pages` reported success — and every
  served page still said `?v=dev`. Proven by writing a file in the workflow
  that was never committed and finding it 404 on the live site while the rest
  of the site was current. If Pages is ever switched to the GitHub Actions
  source, commit-time stamping keeps working regardless, so there is nothing
  to undo.
- **Always pass `reducedMotion: 'reduce'`** on any page that needs
  `window.scrollTo` — Lenis owns the scroll otherwise. Without it, Lenis
  restores its own scroll target on the next frame and the jump is undone
  before the IntersectionObserver ever sees the element, so reveals read as
  `opacity: 0` and the page looks broken when it is not. If you need a page
  with motion *on* (to check the reveals themselves), drive it with
  `page.mouse.wheel(0, 300)` in a loop or `el.scrollIntoView()` — both are
  input Lenis honours. A blank section in a `fullPage` screenshot is this
  artefact far more often than it is a bug; confirm with wheel input before
  changing any code.
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
- Footer legal links (Privacy, Cookie, Terms) point nowhere. Insights is still
  in the spec's architecture but unbuilt, which is why it is absent from the
  header. About and Services now exist and are linked from the nav, drawer and
  footer.
- **`case-study/` (singular) is still the anonymous sample.** "Sample
  engagement", "Confidential distribution group", "Sample quotation — to be
  replaced with a permissioned client quote". It is honest about being a
  placeholder, but the site now also has two *named, real* case studies at
  `case-studies/`, and the homepage still features the anonymous one. Either
  rebuild the homepage section around AGD Global or CyDrive.eu, or retire the
  sample. Not done: it was outside the request that built the new page.
- **The homepage's eight industries are invented and contradict the new
  industries page.** The client named three (§5). Flagged, not changed.
- **The four service detail pages are not built and their URLs 404.** They are
  linked from the four cards on `services/` and nowhere else, deliberately. See
  §5 for the slugs and for what the client still owes us before they can be
  written.
- **The About page's operating-layer diagram uses generic labels** — "Trading
  business", "Digital platform", "Growth-stage group" — not AGD Global,
  CyDrive.eu or MyRealEstate. Naming real businesses is a client decision, not
  ours (§22.13–14). Ask before substituting them.
- **The contact form has no backend.** It posts natively to
  `mailto:hello@inexa.com` with `enctype="text/plain"`, which works with
  JavaScript off; `initContactForm` in `site.js` improves on that by composing
  a readable subject and body. Nothing is silently swallowed — the sent panel
  says the mail client was opened, because that is all that happened. Point
  the form's `action` at a real endpoint and delete the JS handler to switch
  to a server. **Do not replace it with a fake success message.**

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
