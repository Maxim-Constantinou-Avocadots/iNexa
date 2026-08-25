# iNexa — Marketing website

Built to the **iNexa Marketing Website — Design and Build Specification**
(the design MD), on top of the iNexa Design System v1.0. When the two
conflict, the design system wins, then the spec — the source-of-truth order
the spec itself defines.

Open `index.html` in a browser. No build step, no framework, no network
dependency: the typeface is embedded, so the page renders identically from
disk, from a static host, or in an embedded preview.

**Picking this up in a new session?** Read `CONTEXT.md` first — it carries the
decisions, the rejected approaches and the open items, which is the part that
is expensive to rediscover.

```
index.html                  The homepage (spec-driven build)
CONTEXT.md                  Handoff document — why the build is the way it is
tools/                      Browser-measured verification harness
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

## Imagery, icons and the brand atmosphere

Sourced from **Brand Guidelines v1.0 (50pp)**, not invented.

**Photography** — the manual's three principles (pp36–39), lifted from the
document itself and re-encoded for web:

| Image | Principle | Where |
|---|---|---|
| `leadership.jpg` | Executive Leadership (p37) | Why iNexa, full-bleed band |
| `collaboration.jpg` | Meaningful Collaboration (p38) | Case study |
| `operations.jpg` | Operational Confidence (p39) | How we work |

Total image weight 384KB; all three sit below the fold and are lazy-loaded.

**The atmosphere.** The manual's ink-to-blue artwork — used on every
section-divider page (pp1, 4, 13, 22, 29, 34, 40, 45, 50), on the ID cards
(p49) and behind the billboard (p47) — is rebuilt as layered CSS
`radial-gradient`s rather than a raster, so it stays sharp at any viewport
and costs nothing to download. Four variants: `--nx-atmos-hero` (lit from
below), `--nx-atmos-cta` (lit from above), `--nx-atmos-band` (quieter,
mid-page) and `--nx-atmos-light` (Platinum wash).

The ID cards' enlarged-signifier watermark (p49) was tried behind these
sections and removed: the cards have no page frame, but this site does, and
the mark's diagonals crossed the rails and hatch bands at arbitrary angles.
Two structural systems competing for the same space read as noise, not
depth. The signifier keeps its jobs in the header lockup and the dashboard
chrome, where it sits at a legible size.

**The hero.** Title, lead and buttons are a centred stack, with the
operational dashboard below them — the whole composition on one vertical
axis. The dashboard is measured, not guessed: it sheds detail in steps as
the viewport shortens (chart below 820px tall, side rail below 1024px wide,
the aside and the table on phones, the figure meters on short phones) so
that the next section is always reachable within 1.4 screens. Verified
across thirteen viewports from 1920×1080 down to 360×640.

**On the gradient question.** The colour-misuse page (p28) lists "Do not use
gradients", and that rule is kept: nothing on this site puts a gradient on
type, a button, a card, a table, a form control or the logo. The manual's
own artwork nonetheless uses the ink-to-blue atmosphere throughout, so the
ban reads as governing colour *application*, not background treatment —
exactly the interpretation the style guide flagged and the build spec (§16)
asked to have confirmed. **This is now settled by the client's request for
gradients and should be written into the guidelines**, since the misuse page
currently contradicts the applications section.

Contrast was measured against the rendered atmosphere rather than assumed:
Pale Sky never falls below 10.64:1 anywhere over the gradient — far above
the 4.5:1 floor.

**Icons.** A 15-mark set on a 24px grid, 1.5 stroke, round caps, drawn as
`<symbol>` and referenced with `<use>`. Line only, `currentColor` — an icon
can never introduce a second colour. Every one is `aria-hidden`, since each
sits beside a text label.

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
  with a written label (§5.4). Verified structurally: all 21 status-variant
  pills sit inside `.nx-ui` / `.nx-mini` / `.nx-dash` interface panels, none
  in marketing copy.
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
