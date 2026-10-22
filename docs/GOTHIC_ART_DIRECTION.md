# The Gothic reading room

Updated 2026-10-21. This revision follows the user's four historic-library references and supersedes the original cream/burgundy visual direction. Product rules and existing reader data are unchanged.

## Direction

Stone rib vaults, pointed windows, carved walnut, brass, green banker lamps, ivory lettering, and deep shadow. Architecture is the main image; original covers are objects inside the library. The photographic scenes appear on the home page, collection, mood choices, journal invitation, route headers, account page, bookshelf, and book desk.

The current type pairing is **Fraunces 500/600, including italic**, and **Manrope 400/500/600/700**, self-hosted through Fontsource under their bundled SIL Open Font Licenses. This replaces the initial Cormorant Garamond / DM Sans pairing. The lancet-window/rose-window brand ornament is original inline SVG. `src/app/gothic.css` supplies the architectural palette/compositions; `src/app/refined-ui.css` supplies the softer type, rounded controls, and reference-inspired details.

## Rounded interface refinement

The user's later agency-site screenshot informed selected details: capsule buttons with stronger contours, circular arrow wells, a gently tilted brass headline highlight, and a small circular reading seal. The cathedral/library images and walnut/brass/ivory palette remain the foundation. The reference's name, copy, confetti, and draggable agency interface were not copied into the reading app.

Photo panels and route headings use roughly 20–24 px corners; form fields use 12–15 px corners; buttons, tags, navigation selections, and filters use capsule shapes. Book covers retain their physical proportions. The animated camera handoff now interpolates to the destination desk's actual corner radius as well as its bounds and book width.

Current screenshots of this refinement use the `rounded-` prefix. Earlier `gothic-` and `book-motion-v2-` screenshots record previous iterations.

The rounded-interface revision passed type checking and the optimized production build. Browser review covered the home at 320, 360, 768, and 1440 px, mobile search/filter controls, and the animated book handoff into the rounded desk. The 320 px home has equal document client/scroll widths after centering the closing note. No browser console errors were recorded in the final preview. The reference-inspired details add no new animation library or external font requests.

| Token | Current value |
| --- | --- |
| Background | `#12120F` |
| Surface | `#1C1B16` |
| Main text | `#EEE5D4` |
| Supporting text | `#B8AD98` |
| Brass | `#D0AD73` |
| Sage | `#A9B39B` |
| Writing paper | `#E9DFC9` |

## Image assets and provenance

The four architectural images are **AI-generated photorealistic scenes**, not documentary photographs of named libraries. The user's four attachments were visual references for atmosphere and materials; no reference image is served by the site. There are no external image requests or image-service API keys.

Mode: built-in ImageGen, new image generation for the three initial scenes, followed by a local-image edit for the game-inspired hero. All images have opaque backgrounds. Original PNGs were retained under the local Codex generated-images directory; project versions are WebP at quality 90, 1,672 × 941 pixels. The hero edit's exact prompt and output paths are recorded in [Hero environment refinement](HERO_GAME_REALISM.md).

| Project file | Role | Approximate size |
| --- | --- | --- |
| `public/images/gothic-cathedral-game.webp` | Home hero; realistic game environment style | 402 KiB |
| `public/images/gothic-cathedral.webp` | Library header, adventurous mood | 378 KiB |
| `public/images/gothic-archive.webp` | Collection, catalog header, accounts, mood choices, bookshelf | 441 KiB |
| `public/images/reading-desk.webp` | Book transition, reading desk, journal, mood choices | 321 KiB |

Generation briefs, summarized from the generation requests:

1. **Cathedral:** photorealistic 16:9 architectural interior of a Gothic cathedral converted into a library; stone rib vaults, walnut galleries, antique leather books, distant pointed stained-glass window, understated brass chandeliers. Straight verticals and 24 mm framing, warm amber lamps balanced with cool daylight, chestnut/charcoal/gold/teal palette. Left third darker for an ivory headline. No people, text, interface, or fantasy effects.
2. **Desk:** photorealistic 16:9 historic study in dark carved walnut; leather books, small chandelier, green banker lamp at the far-right back corner, leather chair behind the left side. Seated reader viewpoint angled slightly downward, 35 mm framing. Broad polished tabletop occupies the lower part, with the center empty for a programmatically animated book. Worn grain, amber reflections, cool window light. No central book, paper, clutter, people, text, interface, or fantasy effects.
3. **Archive:** photorealistic 16:9 narrow medieval university library aisle; tall carved oak cases, brass gallery railings, aged leather books, heavy timber Gothic tracery, pointed leaded window at the far end, leather-chair alcove on the left. Eye-height 35 mm framing, natural surface irregularities, cool daylight and warm gold lamps. No people, text, interface, or fantasy effects.

## The book-to-desk interaction

Every ordinary internal book link can start the journey, including title links, covers, curated selections, related books, library books, and returning-reader cards. Modified/new-tab clicks retain normal browser behavior. A saved-book shortcut uses the same journey.

The root-layout provider survives navigation. The revised motion uses the selected cover and its measured source position. The original cover disappears as a shared physical volume lifts from that exact location, and the photographic room fades in behind it. Navigation begins after the room has covered the source page.

Placement takes 1.75 seconds, with a slow approach, a small weighted settlement, a broad shadow that tightens near contact, and a separate contact shadow. The book has a back board, visible fore/bottom page edges, a spine crease, and a hinged cover that opens almost flat over 1.1 seconds. The same Volume and DeskBackdrop components render in both scenes.

After opening, the complete scene changes its bounds to the actual inline desk over 720 ms. The book width also matches the destination. The underlying book is concealed until this handoff, avoiding duplicate books, a scale jump, or a cut between two camera positions. The normal sequence lasts about 3.7 seconds, with a visible skip option throughout placement/opening. This is a visual title page, not an ebook reader or a claim to provide the book's text.

Readers can skip with the visible button or Escape, open/close the cover, and replay placement. Replay first closes the volume, then lifts, places, and reopens it. Native modal focus containment and heading focus support keyboard use. Scroll locking preserves the page gutter and is released on completion, cancellation, timeout, and unmount. Resizing skips to the destination instead of keeping stale geometry. Reduced-motion preferences bypass travel; changing the preference during travel/direct placement cancels motion.

The user clarified that the project is a **portfolio demo intended for Vercel**. This revision focuses on motion and presentation. Hosting was not changed or deployed during this work.

## Verification on 2026-10-21

- TypeScript check, four existing domain tests, and the optimized production build passed. The final local preview runs in production mode.
- Browser checks covered desktop and 360 px book layouts, correct covers for different books, landing/opening, close/replay, keyboard skip, focus after travel, mobile navigation, title/author search, mobile filters, private library progress save, shelf preference, and private journal save.
- Browser error log was empty in the tested reader session.
- The v2 motion refinement was checked at 1440 px and 360 px: source cover concealment/restoration, distinct selected covers, placement/opening/docking phases, heading focus, close/replay completion, Escape skip, resize cancellation, scroll-lock release, and no mobile horizontal overflow. Type checking, four domain tests, and the optimized production build passed. The final production preview also passed direct book opening, manual cover controls, and navigation to a second book with heading focus and released scroll lock. The existing backend was not changed.
- Running the development server and type checker together exhausted the host's available memory once. Stopping the development server and limiting compiler concurrency allowed checks/build to complete; the final preview runs the lighter production server.
- The disposable interface-check account and its private test data were removed after the checks. No public reviews were published.
- Reduced-motion behavior was reviewed in code; system media emulation was unavailable in the browser tool. A full accessibility audit remains separate release work.

Current screenshots use the `gothic-` and `book-motion-v2-` prefixes in `docs/screenshots/`. Unprefixed screenshots document the earlier cream design. The v2 images show the placement/opening and camera handoff; v1 book screenshots precede the motion refinement.
