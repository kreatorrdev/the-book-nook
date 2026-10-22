# Implementation and launch status

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
| B7 — QA/launch | Type check, four domain tests, 39 isolated integration checks, production build, and reader browser checks passed. The Vercel production deployment is READY and ten live public/authentication/private persistence checks passed. Full accessibility/security/performance audits remain. |
| B8 — Case study | Architecture, decisions, provenance, browser evidence, and a desktop/mobile screenshot pack are documented in the case study. A published walkthrough remains. |
| B9 — Expansion | Deferred: clubs, challenges, sessions, advanced statistics, social profiles, reader-selectable themes, and full ebook/page-turn reading. The requested Gothic theme and opening-cover animation are delivered. |

## Remaining broader launch work

1. Review trusted proxy behavior, backups, monitoring, and optional mail delivery. Provision an administrator if public reviews are to be enabled.
2. Extend the deployed reader checks to concurrent sessions, ownership between multiple real readers, and moderation. Basic hosted authentication/private persistence and guest privacy passed.
3. Complete keyboard/screen-reader checks, contrast checks across all states, zoom/long-content review, and mobile/tablet screenshots of all core screens.
4. Measure production performance and review indexing, metadata, content, security headers, dependency updates, and recovery procedures.
5. Publish the portfolio walkthrough with the included evidence pack.

The owner approved the Vercel publication and Neon Free resource and accepted marketplace terms. No paid plan or fabricated public reader activity was introduced. The temporary live-verification account and its private records were removed. See [deployment details](VERCEL_DEPLOYMENT.md).
