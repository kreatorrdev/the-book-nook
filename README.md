# The Book Nook

> Source documentation review — 1 November 2026: the source repository is public. Earlier dated references to private source access describe the previous repository setting. Hosted access, private user data and historical verification retain their documented scope.


A Gothic reading sanctuary built from [roadmap v0.2](docs/04_THE_BOOK_NOOK_BOOKS_ROADMAP.md), with the user's subsequent [cathedral/library art direction](docs/GOTHIC_ART_DIRECTION.md). The interface and project documentation are in English.

Live portfolio demo: **https://the-book-nook-wine.vercel.app**. Hosted on Vercel with Neon PostgreSQL. Deployment and live verification details are in [Vercel deployment](docs/VERCEL_DEPLOYMENT.md).

Public source: **https://github.com/kreatorrdev/the-book-nook**. Start with the [English documentation index](docs/README.md), [case study](docs/CASE_STUDY.md), [portfolio copy](docs/PORTFOLIO_COPY.md), and [final quality report](docs/QUALITY_REPORT.md).

## Run locally

Use Node.js 22 or newer (Node.js 24 LTS recommended).

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**. No external account or database service is needed. The first request creates an embedded PostgreSQL database using PGlite in `.data/postgres`, seeds 40 books and five collections, and generates a development authentication secret in `.data/auth-secret`. All of `.data` is ignored by Git. Initial startup includes loading PostgreSQL; subsequent requests reuse the connection.

Create an account through **Sign in → Make yourself at home**. There are no shared demo credentials or pre-created reader records. Your shelves and journal start empty. Unsaved journal drafts are recovered within the same browser tab.

The embedded database supports **one application process at a time**. Stop the server before running commands that directly open the local database, including `db:migrate` and `admin:create`. Use a regular PostgreSQL connection for concurrent processes, hosting, or production.

## What works

- Photorealistic Gothic Reading Room with vaulted architecture, original cover art, an editorial collection, mood discovery, editor's picks, and returning-reader progress.
- Discover with title/author search, genre/mood/collection filters, active chips, reset, sorting, URL state, and mobile filters.
- Continuous book-to-desk animation: lift from the clicked cover, weighted landing and contact shadow, almost-flat cover opening, and a measured camera handoff into the page. Skip/Escape, close/replay, resize recovery, and reduced-motion support are included. Book pages retain original descriptions, edition metadata, related books, library management, independent favorites, and honest review counts.
- Email/password accounts through Better Auth, server sessions, protected destinations, and return to the intended page after sign-in.
- Private library, three reading statuses, paused reading, percentage or edition-bound page progress, and remembered grid/bookshelf views.
- Private journal with linked books, explicit saves, local draft recovery, stale-save protection, unsaved-change warnings, and deletion.
- Explicit public reviews, editing/deletion, spoiler marking, reports, and administrator hide/restore and report resolution.
- Administrator book metadata, genre/mood tags, featured/listed settings, and collection editing.
- Private profile, preferences, password changes, session revocation, and account deletion with cascading reader-data removal.
- Responsive layouts, visible focus, native dialogs, keyboard-accessible controls, reduced motion, loading/error/empty states, local fonts, and reserved cover dimensions.

Public review publication stays closed until at least one administrator exists. Reader accounts cannot grant themselves administrator access.

## Administrator setup

1. Register an ordinary account through the website.
2. Stop the local server when using PGlite.
3. Run `npm run admin:create` and enter that account's email.
4. Restart the server and sign in again. **Content & moderation** appears in the account menu at `/admin`.

The command intentionally grants access only to an existing account; it never installs a default administrator password. For hosted PostgreSQL, run it from a trusted environment with the same `DATABASE_URL` as the application.

## PostgreSQL and deployment

The application uses Next.js App Router, React, TypeScript, Tailwind CSS, Drizzle, PostgreSQL, Better Auth, Zod, and Lucide. PGlite uses the same PostgreSQL schema and queries as the hosted `pg` driver.

For a local PostgreSQL server:

```sh
docker compose up -d
```

Copy `.env.example` to `.env.local`, set `DATABASE_URL=postgresql://booknook:booknook@localhost:5432/booknook`, then run:

```sh
npm run db:migrate
npm run dev
```

For Vercel/Neon or another Node.js host, configure:

The Vercel configuration and release steps are in [Vercel deployment](docs/VERCEL_DEPLOYMENT.md). The Vercel build checks required hosting settings before compiling. The local database and local credentials are excluded from CLI deployment uploads.

| Variable | Requirement |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string; use the provider's TLS parameters and pooled endpoint where appropriate. |
| `BETTER_AUTH_URL` | Exact public HTTPS origin. The local default is `http://localhost:3000`. |
| `BETTER_AUTH_SECRET` | High-entropy secret of at least 32 characters, stable across deployments. |

Run `npm run db:migrate` against the target database as a release step, then `npm run build`. Start with `npm start` on a conventional Node host, or use the host's Next.js integration. Hosted requests do not apply migrations. Seed inserts are idempotent and never overwrite edited catalog copy or reader records.

Never use the embedded filesystem database on serverless hosting. A single-process local production preview can explicitly opt in with `ALLOW_LOCAL_DATABASE=1`; a production-mode authentication secret is still required.

The portfolio demo was deployed to Vercel with a Neon Free database on 2026-10-22. The schema/catalog migration and 20 live checks passed, including all photographic assets, sign-in/sign-up, private shelf/journal persistence, and guest privacy. Mail delivery, monitoring, backups, and trusted proxy/rate-limiter review remain operational work for a broader production launch. Email verification and email-based password recovery are not exposed until a mail provider is configured; authenticated password changes work.

## Verification

```sh
npm run typecheck
npm test
npm run test:integration
npm run build
```

For an explicitly requested live release check, `npm run test:production` exercises the public deployment, creates one temporary reader, verifies private saves, and removes that test account and its private records. It never edits an existing reader account.

Unit tests cover progress limits, unknown editions, percentage conversion, and safe return URLs. Integration checks create an isolated PostgreSQL database and three temporary accounts, then exercise actual authentication and route handlers: ownership, CSRF, edition changes, pauses, journal conflicts, review consent, publication gating, reporting, moderation, catalog changes, retention, sign-out, and account deletion. Test data is removed after the database closes. Tests do not touch the development reader database.

GitHub Actions passed type checking, four domain tests, 39 isolated integration checks, and a production build on Node.js 24. Every build first validates the six required photographic assets, so an incomplete source transfer fails before publication. The build uses one worker to accommodate computers with limited available memory.

## Project guide

| Location | Purpose |
| --- | --- |
| `src/app` | App Router pages, metadata, error/loading states, API routes, and visual system. |
| `src/components` | Reader experience and administrator tools. |
| `src/db` | Drizzle schema, PostgreSQL/PGlite driver selection, initialization, and seeds. |
| `migrations` | Idempotent initial PostgreSQL migration. |
| `src/lib/catalog.ts` | Original seed descriptions, mood tags, and editorial collections. |
| `public/covers` | Original SVG artwork; regenerate with `npm run assets`. |
| `tests` | Domain and isolated integration checks. |
| `docs` | Roadmap, functional/design specifications, delivery notes, and content provenance. |

Catalog genres, mood tags, and collection membership use text/JSONB within the catalog tables. Reader ownership, editions, shelves, journals, reviews, reports, and moderation history use relational tables and constraints. Separate author/tag join tables from the candidate roadmap are a future catalog-normalization task. No external book API is required.

Clubs, challenges, reading timers, social profiles, reader-selectable themes, and page-turn animations remain outside launch scope. The Gothic portfolio demo and hosted launch are delivered; broader service work is tracked in [delivery status](docs/IMPLEMENTATION_STATUS.md). See the [case study and screenshots](docs/CASE_STUDY.md) for the implemented experience and validation evidence.

## Maintaining this project

See the [contribution guide](CONTRIBUTING.md) for setup, relevant checks, documentation and configuration rules.
