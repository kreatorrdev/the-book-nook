# Contributing to The Book Nook

Project documentation and contribution descriptions are maintained in English. Literal interface labels, identifiers and recorded output may retain their original language when needed for accuracy.

## Set up a working copy

Use Node.js 22 or later and `npm ci`, then follow the [README](README.md). PGlite supports one application process at a time.

Run project commands from the repository root.

## Make and validate a change

1. Create a focused branch from the current default branch and read the relevant specification and current status.
2. Make the change and update the affected English documentation.
3. For application changes, run the applicable checks below and inspect the affected experience.
4. Review the diff and open a pull request describing the problem, resulting behavior and checks actually performed. For documentation-only changes, verify links, paths and commands; a full application build is needed only if the change affects it.

~~~sh
npm run typecheck
npm test
npm run build
~~~

Review discovery, reading progress, private shelves, private journal drafts, explicit public reviews and administrator moderation. Verify that one reader cannot access another reader's data. Run `npm run test:integration` for affected database/authentication behavior, following its environment requirements.

## Content and configuration

Record catalog text, cover provenance and fonts in [the content inventory](docs/CONTENT_INVENTORY.md). Keep generated images distinct from documentary claims.

Use your own local configuration. Commit configuration templates with placeholders; keep real credentials, runtime databases, personal records and generated build caches out of Git. Do not add a license or claim redistribution rights for third-party material without the owner's decision.

## Release notes

Use [deployment instructions](docs/VERCEL_DEPLOYMENT.md). Stop the local server before running commands that separately open PGlite; use PostgreSQL for concurrent or hosted processes.

Report dated verification honestly. Existing historical PASS records describe their recorded environment and do not establish that a new checkout or deployment has passed the same checks.
