# The Book Nook — Design specification

Updated 2026-10-21. **The current Gothic direction is specified in [Gothic art direction](GOTHIC_ART_DIRECTION.md).** It replaces the palette and page compositions below with cathedral architecture, walnut/brass surfaces, realistic generated imagery, and animated book placement on a desk. The following records the original 2026-10-20 baseline for historical context; functional interaction rules still apply unless the newer document supersedes them.

## Visual system

| Role | Value |
| --- | --- |
| Paper | `#F7F2E9` |
| Light paper | `#FFFCF7` |
| Ink | `#29251F` |
| Supporting ink | `#625A50` |
| Burgundy | `#743C46` |
| Forest | `#344C40` |
| Warm rule | `#D8CBBB` |

Cormorant Garamond 500/600 creates the expressive headings, italic literary notes, and bookish character. DM Sans 400/500/600 carries interface text. Both are self-hosted through Fontsource; no Google Fonts network request is required. Their bundled OFL licenses are retained with their packages.

The main reading room has a maximum content width of 1,240 px, fine rules, restrained shadows, and modest 3–4 px corner rounding. Responsive typography and cover grids adapt at 1,150, 900, 700, and 430 px. Covers retain a 2:3 frame and contain their source artwork; title and author remain real text outside catalog/library images.

## Page compositions

- **Reading Room:** compact wordmark/navigation, large two-line editorial headline, one burgundy discovery action, three illustrated books on a shelf, a slim welcome rule, a sage collection feature, mood choices, six editor's picks, and a journal invitation. Returning readers receive active progress cards above the collection.
- **Discover:** quiet editorial heading, full-width search, genre/mood controls, sort, active chips and result count, and an aligned cover grid. Mobile filters use a native modal with separate draft selections and Apply/Clear actions.
- **Book details:** prominent original cover, title/author, honest rating state, original introduction, mood tags, one library action and an independent favorite. Lower sections carry editorial context, public reviews, edition information, a private journal link, and related books.
- **My Library:** a private label, status/favorite tabs with real counts, grid/shelf toggle, visible progress and management actions. The bookshelf uses the same records and buttons as the grid; shelf styling never makes an action hover-only.
- **Journal:** numbered entry index and a focused, light-paper writing surface with a narrow margin rule, linked-book selector, explicit private save, saved/unsaved state, and word count.
- **Account/admin:** the same controls, serif hierarchy, small section rules, and restrained colors. Administrator tools separate moderation, catalog, and collection tasks.

## Interaction and states

Important actions use visible labels. Dialogs use native modal focus containment and Escape behavior; dirty review dialogs confirm before discarding. The cover lift and progress changes use short transitions. Reduced-motion preferences remove animation and decorative cover transforms.

States include skeleton-free route loading, server error recovery, empty library/journal, no search results, image-load fallback, unknown edition metadata, disabled publishing before moderation setup, pending writes, success toasts, retained drafts after failures, stale-save errors, and hidden-review owner messaging.

The Art of War is the intentional designed fallback-cover sample in a fresh seed. Other covers also switch to the same text treatment on image failure. Long titles and unknown page totals are present in the actual curated catalog.

Core ink/paper and burgundy/light-paper combinations are selected for contrast. Secondary controls and focus remain visible at narrow sizes. A complete WCAG 2.2 AA audit, screen-reader workflow review, and 200%/400% zoom review remain release checks; the selected design treatments do not constitute a certification.
