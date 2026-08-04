# iNexa — Marketing website

Built to the **iNexa Marketing Website — Design and Build Specification**
(the design MD), on top of the iNexa Design System v1.0. When the two
conflict, the design system wins, then the spec — the source-of-truth order
the spec itself defines.

Open `index.html` in a browser. No build step, no framework, no network
dependency: the typeface is embedded, so the page renders identically from
disk, from a static host, or in an embedded preview.

```
index.html                  The homepage
style-guide/index.html      The design system document
assets/
  css/
    fonts.css               Manrope, self-hosted (data URI)
    inexa-tokens.css        Token layer, from the style guide
    inexa-components.css    Component layer, from the style guide
    site.css                Marketing layer for this site (nx- prefix)
  js/site.js                Progressive enhancement only
  fonts/*.woff2             Raw font files, for production hosting
```

## Homepage sequence — spec §12, followed exactly

1. **Hero** (Ink) — the two-line positioning pairing, one colour, with an
   operational-view interface built from the system's own tabs, tables and
   pills. Content and interface sit in the spec's 5/7 asymmetry.
2. **Trust context** — bordered grid of sectors and system categories.
   No metrics, because none are verified yet.
3. **Operational challenge** (Platinum) — four shared-border cells,
   deliberately unnumbered.
4. **Services** — vertical tab rail with a large active panel on desktop;
   the same DOM is an accordion below 1024px. Not numbered: a set, not a
   sequence. Responsibilities per service are the spec's own lists.
5. **Operational transformation** (Ink) — Before iNexa / With iNexa, the
   spec's six rows verbatim.
6. **How we work** (Platinum) — Assess → Design → Implement → Manage,
   numbered because it is a real sequence, with the spec's outputs.
7. **Featured case study** — the spec's editorial cell grid: headline,
   client data, challenge and approach, outcomes, interface, quotation.
8. **Systems view** (Ink) — the spec's approved-component alternative to a
   systems map: tabs over integration and ownership tables.
9. **Client experience** — asymmetrical quote grid: one large quotation,
   one smaller, one supporting fact.
10. **Strategy call CTA** (Ink) — spec copy; the brand promise closes the
    page and is never the headline.

**There is deliberately no pricing section.** Spec §12: a consultancy site
does not inherit a SaaS pricing table from the reference.

**One CTA phrase throughout:** "Book a strategy call", exactly as the spec
requires. Secondary actions vary only where their destination differs.

## Spec rules that changed this build

- **Container 1280px, 24px gutters** (§7.2), section rhythm 96/48px (§7.5).
- **Sentence case** headlines, per every heading direction in the spec.
- **No blur on the stuck header** (§11.2) — solid ink surface, visible
  border, shadow-sm.
- **Motion** (§9): opacity reveals with a ≤12px entrance, tab-panel fades,
  drawer and accordion transitions. Nothing else. The previous build's
  smooth-scroll library, marquee, scroll-progress bar and number counters
  were all removed — they sit outside the spec's approved-motion list
  (continuous decorative movement is prohibited, and counters are reserved
  for real metrics, which we do not yet have).
- **Functional status colours appear only inside interface mockups**, always
  with a written label (§5.4). Verified structurally: all 27 status pills sit
  inside `.nx-ui` / `.nx-mini` interface panels, none in marketing copy.
- The spec's global reduced-motion override (§9.4) is included verbatim.

## Verified in a real browser

- No JS errors; no horizontal overflow and no navigation overflow at ten
  widths from 1440px down to 390px.
- Every painted colour resolves to the approved palette, the derived ramp,
  or (inside interface mockups only) the functional status tokens.
- Only Manrope weights 400 and 600 anywhere on the page.
- Only the three motion duration tokens (120/200/360ms) appear.
- One `h1`; ordered headings; every control and SVG labelled; no duplicate
  IDs; focus rings everywhere; services rail and tabs fully keyboard
  operable (arrow keys included); wide tables scroll in their own focusable
  region.

## Placeholders — the spec's own rule, applied

Spec §22.13–14: never invent client material; placeholders only where
content is unavailable, marked clearly. Accordingly:

- The **case study** carries a visible "Sample engagement" pill, its
  outcomes are labelled "sample figures", and the quotation is captioned as
  a sample. It must be replaced with a verified, permissioned story.
- The **client experience** quotations are marked as samples in the section
  lead and in each attribution.
- The hero and systems interfaces are labelled **Sample**.
- No invented people, no invented logos, no invented metrics anywhere.
- Footer legal links (Privacy, Cookie, Terms) point nowhere yet — those
  pages are in the spec's architecture but outside this scope, as are the
  About and Insights pages (which is why they are absent from the header).

## Notes for the brand owner

1. The style guide ships at `style-guide/` with one CSS repair: the original
   file's status-colour comment closed early, which cost it the
   `--inx-status-success` declaration (the Success pill's dot rendered
   invisible). Detailed in the style-guide commit.
2. Photography (§16) is specified but not yet sourced; the page currently
   carries none rather than using stock that violates the direction.
3. The spec's photographic ink-to-blue gradient interpretation (§16) still
   needs written confirmation from the brand owner; nothing on this page
   depends on it.
