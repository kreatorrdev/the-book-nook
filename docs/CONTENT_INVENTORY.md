# Content and asset provenance

Updated 2026-10-21.

The catalog contains 40 real works, not fabricated community activity. Titles, author names, and original-publication years identify the works; first-publication years can differ from title-page dates and later translations. The Art of War uses an intentionally approximate ancient date.

All descriptions, collection introductions, editorial notes, microcopy, and cover illustrations in this project were written or constructed for The Book Nook. No publisher jacket images, publisher descriptions, user reviews, or rating aggregates were scraped or copied. A public-domain status claim for a work is not used as a blanket license for any particular translation, edition, or jacket design.

## Covers

`scripts/covers.ts` constructs SVG assets from original geometric, botanical, moon, window, and wave motifs. The files are in `public/covers/`; the corresponding content/color/motif record is in `src/lib/catalog.ts`. Cover labels explicitly identify The Book Nook collection. Artwork is an interpretation and is not presented as the cover of a commercial publisher's edition.

The intentional fallback sample is The Art of War. It displays a designed title/author cover without relying on an image load. The same treatment handles failed images elsewhere. Page totals are unknown for the unspecified editions and are never inferred from artwork.

## Bibliographic edition sample

Pride and Prejudice, Penguin Classics paperback, ISBN **9780141439518**, uses **448 pages**, following the publisher's current product details (publication date 31 December 2002). Some retailer records for the same ISBN list 480 pages; those were not adopted. Readers should select an edition matching the copy they have, rather than treating any work-level page total as universal.

Source: [Penguin Random House product details](https://www.penguinrandomhouse.com/books/286387/pride-and-prejudice-by-jane-austen-edited-with-an-introduction-and-notes-by-vivien-jones-original-penguin-classics-introduction-by-tony-tanner-cover-by-coralie-bickford-smith/9780141439518/), checked 2026-10-20. The page is linked for factual metadata; no publisher description or cover was reproduced.

## Fonts and icons

The current Gothic revision includes four locally served, AI-generated photorealistic architectural scenes (including the game-inspired home hero) and an original SVG lancet-window mark. The supplied reference photographs informed atmosphere and materials; they are not redistributed in the app. These scenes do not depict verified real locations. Asset paths, generation mode, and prompt briefs are recorded in [Gothic art direction](GOTHIC_ART_DIRECTION.md); the latest hero's exact prompt is in [Hero environment refinement](HERO_GAME_REALISM.md).

Fraunces and Manrope are the current locally hosted Fontsource typefaces, under their bundled SIL Open Font Licenses. The earlier design used Cormorant Garamond and DM Sans. Lucide provides the consistent outline icons under its bundled ISC license. Package versions are locked in `package-lock.json`; original license files remain in the installed packages. The circular reading seal and lancet-window mark are original SVG/interface work.

## Reader contributions

There are no seeded user reviews, review counts, ratings, or private notes. Any review displayed by the running app comes from an account that explicitly published it. Automated test reviews live only in an isolated disposable test database.
