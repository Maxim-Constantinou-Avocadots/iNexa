# iNexa — Marketing website

Built to the **iNexa Marketing Website — Design and Build Specification**
(the design MD), on top of the iNexa Design System v1.0. When the two
conflict, the design system wins, then the spec — the source-of-truth order
the spec itself defines.

Open `index.html` in a browser. No build step, no framework, no network
dependency: the typeface is embedded, so the page renders identically from
disk, from a static host, or in an embedded preview.

```
index.html                  The homepage (spec-driven build)
previous/index.html         Frozen snapshot of the pre-spec build, for comparison
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

## Homepage sequence

Fourteen sections. The build-spec sequence, with pricing, industries,
insights and the FAQ retained by client decision.

Hero · Why iNexa · Operational challenge · Services · Operational
transformation · How we work · Case study · Industries · Systems view ·
Client experience · Engagement model · Insights · Questions · Strategy-call
CTA · Footer.

**One CTA phrase throughout:** "Book a strategy call".

## The page frame

The reference's structural signature, rebuilt with flat palette fills:

- **Rails.** Continuous vertical rules at the container edges. Every section
  carries its own pair via `.nx-rail`, so the border token re-points on ink
  surfaces automatically while all pairs sit at the same x and read as one
  frame. Header, footer and drawer use `.nx-rail--quiet` — the same inset
  without the rules, plus 1px to compensate for the rail's own border.
  Verified: every content left edge on the page measures to exactly 129px
  at 1440.
- **Hatch bands.** Diagonal-hatch separators between sections, drawn from an
  SVG of flat 1px lines in a ramp colour (`n-100` on light, `n-800` on ink)
  — no gradient function, the same reasoning the design system used for its
  select chevron. Bounded top and bottom by hairlines so the band reads as
  part of the frame rather than a texture leak.

## Amendments to the build spec, approved by the client

The MD's motion list does not cover these; they are kept deliberately and
should be added to the spec:

1. **Lenis smooth scroll** — the largest single contributor to the premium
   feel. Disabled entirely under `prefers-reduced-motion`.
2. **Number counters** on the Why iNexa figures. The section carries a
   visible "sample figures" caption until the numbers are verified.
3. **Pricing section retained.** The MD advises against it for a
   consultancy; kept by client decision. Figures are illustrative and say so
   on the page.

Dropped as the MD requires: the marquee (continuous decorative movement).
Headlines are sentence case throughout, per the MD.

## Spec rules that changed this build

- **Container 1280px, 24px gutters** (§7.2), section rhythm 96/48px (§7.5).
- **Sentence case** headlines, per every heading direction in the spec.
- **No blur on the stuck header** (§11.2) — solid ink surface, visible
  border, shadow-sm.
- **Motion** (§9): opacity reveals with a ≤12px entrance, tab-panel fades,
  drawer and accordion transitions, plus the two approved amendments above.
  No marquee, no scroll-progress bar, nothing over 360ms.
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
4. `previous/` is a frozen snapshot of the pre-spec build (14 sections,
   pricing, smooth scroll), kept only so the two versions can be compared
   side by side. It is not maintained and should be deleted once a
   direction is chosen.
