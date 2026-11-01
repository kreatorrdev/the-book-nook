# Implementation and launch status

> Source documentation review — 1 November 2026: the source repository is public. Earlier dated references to private source access describe the previous repository setting. Hosted access, private user data and historical verification retain their documented scope.


Updated 2026-10-22. The portfolio demo is deployed at **https://the-book-nook-wine.vercel.app**, with Vercel and Neon PostgreSQL. This document records delivered behavior separately from the planning roadmap. The user's Gothic revision supersedes the initial cream design; see [current art direction and verification](GOTHIC_ART_DIRECTION.md).

| Phase | Current result |
| --- | --- |
| B0 — Product rules | Functional specification resolves status/paused behavior, edition resets, retention, private writing, consent, and moderation. |
| B1 — Literary design | Gothic cathedral/library composition, photorealistic local assets, dark walnut/brass/ivory palette, self-hosted type, original covers, and principal reader screens. Current book/home desktop/mobile screenshots use the gothic prefix; assistive and zoom review remains. |
| B2 — Foundation | Next.js/React/TypeScript, Drizzle/PostgreSQL, Better Auth, SQL migration, local persistent PGlite, seeds, checks, and CI configuration. The hosted Neon migration and live reader persistence passed. |
| B3 — Discovery | Guest home, catalog, title/author search, genre/mood/collection filters, URL state, sorting, details, and five original collections. |
| B4 — Reader essentials | Real accounts, private library/favorites/progress/paused books, private journal, draft recovery, stale-save protection, explicit public reviews. |
| B5 — Content/moderation | Admin metadata/tags/collection editing, reversible catalog withdrawal, reports, hide/restore audit, and server role enforcement. Publishing requires a provisioned administrator. |
| B6 — Signature | Book-to-desk navigation with selected cover, perspective placement and shadow, opening cover, skip/Escape/replay, native dialog containment, and reduced motion. Equivalent grid/bookshelf actions and persisted view preference remain. |
| B7 — QA/launch | GitHub Actions passed type checking, four domain tests, 39 isolated integration checks, and a production build. Vercel is READY; 20 live public/image/authentication/private persistence checks passed. Final Chrome desktop/mobile review and release screenshots are included. Independent accessibility/security/performance audits remain outside the demo scope. |
| B8 — Case study | Source, original assets, current and historical screenshots, architecture, decisions, provenance, quality report, portfolio descriptions, and walkthrough outline are delivered in the public GitHub repository with English documentation. |
| B9 — Expansion | Deferred: clubs, challenges, sessions, advanced statistics, social profiles, reader-selectable themes, and full ebook/page-turn reading. The requested Gothic theme and opening-cover animation are delivered. |

## Remaining broader launch work

1. Review trusted proxy behavior, backups, monitoring, and optional mail delivery. Provision an administrator if public reviews are to be enabled.
2. Extend the deployed reader checks to concurrent sessions, ownership between multiple real readers, and moderation. Basic hosted authentication/private persistence and guest privacy passed.
3. Extend the completed bounded keyboard/mobile review with independent screen-reader, contrast, zoom, and long-content audits across all states.
4. Obtain field performance measurements and review monitoring, dependency updates, and recovery procedures. Canonical/social metadata, robots, sitemap, mobile hero optimization, and database-region colocation are delivered; PageSpeed API measurement was unavailable because its shared quota was exhausted.
5. Optionally record a portfolio video using the delivered English copy, walkthrough outline, and screenshots.

The owner approved the Vercel publication and Neon Free resource and accepted marketplace terms. No paid plan or fabricated public reader activity was introduced. The temporary live-verification account and its private records were removed. See [deployment details](VERCEL_DEPLOYMENT.md).
