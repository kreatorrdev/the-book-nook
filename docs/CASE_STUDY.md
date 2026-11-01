# The Book Nook — A Gothic reading sanctuary

> Source documentation review — 1 November 2026: the source repository is public. Earlier dated references to private source access describe the previous repository setting. Hosted access, private user data and historical verification retain their documented scope.


**Live portfolio demo:** [the-book-nook-wine.vercel.app](https://the-book-nook-wine.vercel.app). Updated 2026-10-22. Source and English documentation: [public GitHub repository](https://github.com/kreatorrdev/the-book-nook).

Scope: product rules, Gothic visual direction, responsive interface, book interaction, authentication, PostgreSQL persistence, deployment, and documentation. The owner's references and feedback guided the work, with AI-assisted implementation and original generated architectural assets.

## The experience

The revised roadmap asked for an editorial library whose functional depth supported its visual identity. The implementation centers on one connected journey: discover a book, choose a place for it in a private library, record progress against the right edition, and write a private reflection. Public reviews are a separate decision with working reporting and moderation.

Cathedral stone, walnut shelves, warm brass, ivory lettering, and realistic library scenes establish the reading room. Fraunces and Manrope provide the literary/display and interface type. Capsule controls, softer panel corners, a tilted brass headline label, and a circular reading seal add character without taking attention away from the books. The architectural images are original AI-generated scenes, not photographs of identified libraries.

The signature interaction starts at the selected cover: a volume lifts from its position, approaches an antique desk, lands with a tightening contact shadow, opens, and moves with the room into the book page. Skip, Escape, replay, resize recovery, and reduced-motion behavior keep the interaction usable. It opens a visual title page rather than pretending to provide a licensed ebook.

## Screens

Library and journal screenshots use a disposable **Interface Check** account with explicitly temporary private writing. They illustrate interface behavior, not real community activity. No demo reviews or ratings were published. The test account is removed after verification.

| Experience | Desktop | Mobile |
| --- | --- | --- |
| Reading Room | [Published home](screenshots/final-home-desktop.png) | [Published mobile home](screenshots/final-home-mobile.png) |
| Discover | [Catalog baseline](screenshots/discover-desktop.jpg) | [Published mobile search](screenshots/final-discover-mobile.png) |
| Book details | [Book interaction](screenshots/book-motion-v2-final.jpg) | [Published mobile desk](screenshots/final-book-mobile.png) |

The screenshot directory also retains the earlier cream interface and successive Gothic/motion iterations as design history; those files are not the current visual specification.

## Decisions with functional consequences

- Favorites is independent of status. A reader can love a book they have not finished.
- Pausing preserves a reader's place without manufacturing a completed book.
- An edition belongs to one work. Page measurements require its known total; all other editions use reader-entered percentages.
- Removing a shelf entry never removes the reader's writing.
- Journal saves are explicit, version-checked, and recoverable. A tab-scoped local draft survives navigation and failed writes.
- Public reviews require consent and an administrator who can moderate. A hidden review stays hidden after its author edits it.
- Withdrawing a catalog item does not make an existing reader's library/journal references disappear.

## Architecture

Next.js App Router serves dynamic public and protected pages. React provides the reader interface; route handlers perform Zod validation, origin checks, ownership filtering, and database transactions. Better Auth manages credentials and server sessions, while Drizzle accesses PostgreSQL.

PGlite gives the project persistent local PostgreSQL without service credentials or a Docker prerequisite. A standard `pg` connection uses the same schema and queries for Neon or a conventional PostgreSQL host. Hosted migrations are explicit release steps; request handlers never race to change the production schema.

The schema enforces one shelf entry and one review per reader/work, edition/work relationships, valid statuses/progress ranges, unique reports, and account-deletion cascades. Catalog tags and membership use text/JSONB for this bounded curated collection; a normalized author/tag catalog remains a clear future migration if content operations grow.

## Validation evidence

- TypeScript checking and the optimized production build pass.
- GitHub Actions runs the complete type/domain/integration/build workflow successfully. Twenty hosted smoke checks verify public images, metadata, authentication, private persistence, and guest isolation.
- Four domain tests exercise progress bounds, unknown page totals, percentage calculation, and safe internal return destinations.
- Thirty-nine integration checks exercise actual authentication and PostgreSQL route handlers. They cover two-reader isolation, unauthorized writes, CSRF, edition limits/resets, pause behavior, journal conflicts, review consent/gating, reporting, hide/restore, catalog editing/withdrawal, retained writing, session revocation, account deletion, and persistence after closing/reopening the on-disk database.
- Browser checks cover title/author search, mobile filter Apply behavior, sorting, preserved query state after book navigation and sign-in, responsive library controls, keyboard activation of the progress dialog, a saved 35% → 42% progress change, bookshelf selection, journal draft recovery, explicit saving, and reopening the saved entry.
- Home, book, library, and journal layouts were checked for horizontal overflow at narrow widths. Tablet and desktop viewport samples were also inspected. Images reserve space; below-fold covers load lazily.
- The runtime dependency audit reported no known vulnerabilities on 2026-10-20. This is a dependency snapshot, not an application security certification.

## Practical limits

The portfolio demo is deployed on Vercel with Neon Free PostgreSQL. Hosted checks cover real authentication, private shelf/journal persistence, and guest privacy, and the disposable verification account is removed afterward. The delivery report records the exact checks and measurement limits; it does not claim a full WCAG certification or field Core Web Vitals results.

The final performance pass colocates server execution with the Frankfurt database, splits secondary route code from the home bundle, and serves a 129,222-byte mobile hero instead of the 411,822-byte landscape asset at phone widths. Canonical URLs, social previews, robots rules, and a public-entry-point sitemap support sharing and indexing. The mobile navigation supports Escape and focus return.

Email verification/password recovery, broader operational monitoring/backups, and independent assistive-technology/security review remain optional work beyond this portfolio demo. Public reviews remain gated until an administrator is provisioned. No reviews, ratings, usage numbers, or business outcomes were invented.

Clubs, social profiles, reading timers, challenges, advanced statistics, dark mode, and page-turn effects stay deferred in line with roadmap v0.2.
