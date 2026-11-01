# Portfolio presentation

> Source documentation review — 1 November 2026: the source repository is public. Earlier dated references to private source access describe the previous repository setting. Hosted access, private user data and historical verification retain their documented scope.


## Short description

The Book Nook is a Gothic reading sanctuary that combines a cinematic library environment with useful, private reading tools. Readers can explore a curated catalog, organize their shelves, track progress against the right edition, and keep a personal journal. Selecting a cover brings the book onto an antique desk and opens it through a continuous animation.

## Project card

**The Book Nook**

A literary web app with cathedral-inspired imagery, a cinematic book-to-desk interaction, private shelves, and a reading journal.

**Stack:** Next.js, React, TypeScript, Tailwind CSS, Drizzle, PostgreSQL, Better Auth, Vercel, and Neon.

**Live demo:** https://the-book-nook-wine.vercel.app

**Source:** public repository, https://github.com/kreatorrdev/the-book-nook.

## Longer case-study introduction

The challenge was to make a reading app feel like a place worth spending time in, while keeping discovery and personal organization straightforward. The visual direction draws on Gothic libraries: pointed vaults, dark walnut, warm lamps, and quiet daylight. Original generated architectural scenes and illustrated covers establish that atmosphere, while Fraunces and Manrope keep the interface readable.

The central interaction follows a selected book from its cover into a reading room. A weighted landing, contact shadow, opening cover, and continuous handoff connect the catalog to the detail page. The motion includes a skip option and reduced-motion support.

Behind the presentation, the app uses real authentication and PostgreSQL persistence. Shelves, progress, profiles, and journal entries belong to individual readers. Page-based progress requires a known edition, and publishing a review is a separate, explicit choice. The deployed demo was checked against its hosted database using temporary verification data that was removed after testing.

## Suggested 60–90 second walkthrough

1. Show the Reading Room and its architectural hero.
2. Enter Discover, search for a title, and try a mood filter.
3. Open a book and let the desk animation finish; show skip/replay controls.
4. With a personal account, save a book, change its reading status, and update progress.
5. Save a private journal reflection and reopen it.
6. Finish with the mobile layout and a brief explanation of the stack and deployment.

Use your own account for a recorded walkthrough and avoid showing private email addresses, secrets, or personal writing. Generated imagery and AI-assisted implementation should be described honestly. No commercial impact, traffic, conversion, or usability-study results are claimed.
