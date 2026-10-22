# Vercel deployment

Updated 2026-10-22. The portfolio demo is live at **https://the-book-nook-wine.vercel.app**. Vercel reported the production deployment as `READY`; independent requests confirmed that the public production domain works without a Vercel session.

Application release source: `a0348a87bd6afeee9561e1fccb3cfb919e18b3ba`. The private GitHub repository is connected to Vercel; changes on `main` publish automatically. Use the production alias above for the current demo and the project dashboard for immutable deployment records.

Project dashboard: https://vercel.com/kreatorrdev/the-book-nook

The remote project was verified with the Next.js preset, Node.js 24.x, `npm ci`, and `npm run build:vercel`. The five environment-validation scenarios and Vercel configuration check passed. `BETTER_AUTH_URL` uses the assigned production origin, `https://the-book-nook-wine.vercel.app`. A fresh random `BETTER_AUTH_SECRET` was stored directly in Vercel as a production secret, without writing its value to a file or output.

The owner explicitly approved the new Neon resource and confirmed accepting its marketplace terms. `book-nook-db` is ready on the `free_v3` (Free) plan in Frankfurt (`fra1`), connected only to this project's production environment. Resource ID: `store_AiiidyHGn8RqEtqb`. Neon built-in authentication is disabled because the application uses Better Auth. `vercel env run -e production -- npm run db:migrate` successfully initialized the schema and curated catalog against the hosted PostgreSQL database. Credentials were passed in process memory. Local reader accounts, shelves, and journals were not transferred.

The project is a full Next.js app. Keep the Next.js framework preset, project root at this directory, and Node.js 24.x. The tracked `vercel.json` installs from the lockfile, places server functions in Frankfurt (`fra1`) beside the database, and runs `npm run build:vercel`. It checks required environment settings and the six required photographic assets before building. `.vercelignore` excludes local credentials, local reader data, build caches, and screenshots from CLI uploads.

## Required setup

Connect the owner's Vercel account, create or select the project, and attach a PostgreSQL database such as Neon using the Vercel Marketplace. Choose the intended public project domain before configuring authentication.

Configure these **server-only** environment variables in the Vercel project:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Hosted PostgreSQL connection URL, with the provider's TLS settings and pooled endpoint when available. |
| `BETTER_AUTH_URL` | Exact public HTTPS origin for that environment, without a trailing slash. |
| `BETTER_AUTH_SECRET` | A fresh random secret of at least 32 characters, retained between deployments. Generate it with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"` and store it directly in Vercel's environment settings. |

Do not add the `NEXT_PUBLIC_` prefix to any of these values. Leave `ALLOW_LOCAL_DATABASE`, `BOOK_NOOK_DATA_DIR`, and `BOOK_NOOK_MIGRATE` unset on Vercel. A preview deployment needs its own matching auth origin and separate database; production settings must not be reused for a preview with a different origin.

## Release

1. Set `DATABASE_URL` in the trusted migration process to the target hosted database. Do not replace the existing local `.env.local` with downloaded production credentials.
2. Run `npm run db:migrate`. This creates the schema and seeds the 40 catalog books and five collections. Existing catalog edits and reader records are not overwritten. This does not copy local reader accounts, shelves, or journals to the hosted database.
3. Publish from the connected Vercel project, or use the authenticated Vercel CLI from this directory. `npx vercel link` links the checkout; `npx vercel --prod` builds and publishes using the remote project's production environment. Do not put credentials in command arguments or commit them.
4. Verify the deployed home, discovery, a book's desk animation, sign-up/sign-in, a private shelf save, and a private journal save. Confirm the final public domain works without the owner's Vercel session.

Hosted incoming requests do not apply migrations. The local embedded PGlite database is intentionally not used on Vercel. The owner-approved Neon Free resource is used for production. No paid plan or custom domain was provisioned.

## Production verification

Twenty live checks passed: public home; all five WebP images and the JPEG social preview with their expected type, size, and image signature; canonical/social metadata; robots/sitemap; authentication-page noindex; all 40 books and five collections from hosted PostgreSQL; a public book page; sign-up, sign-out, password sign-in; private shelf and journal persistence; session/record persistence across independent requests; guest exclusion of private records; and cleanup of the temporary verification account and its private records. No test review or public activity was created. The original local reader database was not changed. Run the manual check with `npm run test:production`.

Chrome review confirmed the loaded hero at desktop/phone sizes, no horizontal overflow at the sampled 320/360/1440-pixel widths, mobile-menu Escape/focus behavior, the skip link, Walden search, a keyboard-dismissable filter dialog, labeled sign-in fields, and the animated handoff to an open cover on the loaded reading desk with scroll locking released. Current evidence uses the `docs/screenshots/final-` prefix. The public production domain is accessible without Vercel sign-in; Vercel authentication protection remains on protected deployment URLs.

GitHub Actions passed type checking, four domain tests, 39 isolated integration checks, and a production build on Node.js 24: [validated application workflow](https://github.com/kreatorrdev/the-book-nook/actions/runs/39817284680). The [quality report](QUALITY_REPORT.md) records measurement limits and optional broader service work.

## References

- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Deploy from the CLI](https://vercel.com/docs/projects/deploy-from-cli)
- [Environment variables](https://vercel.com/docs/environment-variables)
- [Supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
