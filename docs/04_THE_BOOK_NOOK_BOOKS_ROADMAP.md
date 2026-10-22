# The Book Nook — A Reader's Universe

**Project roadmap v0.2 | Updated: 2026-10-19 | Status: planning baseline; implementation not started**

This is the current project roadmap. It incorporates the changes described in [Roadmap Review and Design Direction](ROADMAP_REVIEW.md) and supersedes v0.1 for project planning.

## 1. Vision and audience

Create a warm, elegant home for devoted readers: discover books, maintain a personal library, track reading progress, write private reflections, and intentionally publish reviews. The experience should combine the intimacy of a private library with the editorial quality of a literary magazine.

**Portfolio objective:** demonstrate distinctive visual design and a complete full-stack reader journey, including relational data, persistent state, ownership, privacy, search, content management, and review moderation.

**Language:** all documentation and application interface text are written in English.

**Core journey:** discover a book → inspect its details → add it to My Library → update reading progress → write a private journal entry → optionally publish a public review.

## 2. Experience principles

- Establish hierarchy through expressive typography, generous spacing, and carefully presented book covers.
- Use shelf edges, bookmarks, fine rules, and restrained paper details to express the library identity.
- Keep essential actions visible and usable with touch, keyboard, and pointer input.
- Offer an accessible cover grid alongside the signature bookshelf view. Both use the same records and actions.
- Keep the library and journal private by default. Publishing a review is an explicit action.
- Use short, purposeful motion and respect reduced-motion preferences.
- Give loading, empty, error, and success states the same attention as populated screens.
- Keep challenges optional and encouraging when introduced; avoid pressure-based engagement mechanics.

## 3. Visual direction and design system

**Direction:** a warm, elegant library with an editorial composition and a complete light theme for launch.

### Initial palette

These values guide the prototype. Validate actual text, control, and focus-state combinations before implementation.

| Role | Color | Application |
|---|---|---|
| Paper | `#F7F2E9` | Main background |
| Light paper | `#FFFCF7` | Forms and elevated surfaces |
| Ink | `#29251F` | Body text and headings |
| Secondary ink | `#625A50` | Supporting copy and metadata |
| Burgundy | `#743C46` | Primary actions and selected states |
| Forest | `#344C40` | Secondary accents and reading indicators |
| Warm rule | `#D8CBBB` | Decorative separators and shelf details |

### Typography, layout, and imagery

- Pair one expressive serif family for headings with one readable sans-serif family for controls and metadata. Finalize families after testing real titles and licensing.
- Start body text at 16–18 px; use fluid headings and comfortable line spacing. Keep long-form reading widths around 60–70 characters.
- Use a consistent spacing scale, modest corner rounding, fine borders, and restrained shadows. Book covers carry the strongest visual depth.
- Use approximately 2:3 cover frames while preserving source image proportions and avoiding cropped artwork or titles.
- Display the title and author as real text outside the cover. Provide a designed fallback for missing images.
- Keep paper texture subtle and away from reading and form surfaces. Use one consistent outline icon style.
- Design representative layouts at 360, 768, and 1440 px, then verify intermediate widths, narrow layouts, zoom, and long content.

### Key page compositions

| Screen | Composition and priority |
|---|---|
| Home | Compact header, editorial headline, short introduction, “Discover your next read” action, and a composition of three to five covers. Follow with a featured collection, mood choices, and editor's picks. Returning readers see “Continue reading” near the top when applicable. |
| Discover | Prominent search, result count, active filter chips, reset and sort controls, and a consistent cover grid. Use a compact desktop filter area and an accessible mobile filter sheet. Preserve search/filter state in the URL. |
| Book Details | Cover, title/author hierarchy, short description, library state, and one primary library action. Follow with full description, edition metadata, editorial context, public reviews, and related books. |
| My Library | All, Want to Read, Currently Reading, Read, and Favorites views; visible progress actions; grid and optional bookshelf presentation with a remembered view preference. |
| Journal | Simple entry index and focused editor with a visible “Private” label, optional linked book, explicit saving, and an unsaved-change warning. Use typography and subtle margin details to evoke a notebook. |

The first visual review covers Home, Discover, Book Details, and My Library on desktop and mobile, plus the Journal editor. Supporting screens reuse the resulting design system.

## 4. Information architecture

**Primary navigation at launch:** Home, Discover, My Library, Journal. Account actions live in a secondary menu. Guests can browse Home, Discover, and Book Details; personal destinations require authentication and preserve the intended destination after sign-in.

| Route | Launch scope | Purpose |
|---|---|---|
| `/` | MVP | Reading room, editorial collections, and relevant continue-reading content |
| `/discover` | MVP | Search by title/author and filter by genre or manually assigned mood |
| `/books/[slug]` | MVP | Book details, edition information, library actions, and public reviews |
| `/my-shelves` | MVP | My Library: reading statuses, favorites, and active progress |
| `/journal` and `/journal/[entryId]` | MVP | Private entry index, creation, editing, and reading |
| `/sign-in` and `/sign-up` | MVP | Account access with a return to the intended destination |
| `/profile` and `/settings` | MVP | Private profile editing, preferences, privacy, and account settings |
| `/admin` | MVP | Book metadata, genres/moods, collections, reports, and review moderation |
| `/reading` | Later | Reading sessions, time tracking, and timeline |
| `/reviews` and `/reviews/[slug]` | Later | Standalone review browsing and editorial destinations |
| `/clubs` and `/clubs/[slug]` | Later | Book clubs, monthly reads, and moderated discussion |
| `/challenges` | Later | Optional goals, challenges, and statistics |

Future destinations are added to navigation when they provide a complete experience. Public profiles are outside launch scope.

## 5. MVP features and behavior

### Discovery and content

- Curated searchable catalog, book details, genre filters, manually tagged mood discovery, and featured collections.
- Mood selections map to explicit content tags and produce useful results or an intentional empty state.
- Content target: approximately 36–60 curated books and 4–6 editorial collections with original introductions. Include missing-cover and incomplete-metadata examples for validation.
- Record cover source and usage status. Use original or appropriately licensed descriptions and editorial copy.
- Display genuine review counts and ratings. Clearly label illustrative demo reviews and provide honest empty states.
- Curated seed content supports the full MVP independently of external catalog services.

### My Library and progress

- One library entry per user and book/work, with one reading status: Want to Read, Currently Reading, or Read.
- Favorites is an independent flag, exposed through a filtered view. A favorite can have any reading status. Favoriting a book outside the library prompts for an initial status.
- Support adding, changing, and removing library entries. Library removal must not silently delete linked journal entries or public reviews; finalize retention and progress-reset details in B0.
- Use a lightweight edition record with format, language, optional identifier, and optional page count. An entry may select an edition.
- Accept page-based progress only for an edition with a known page count. Otherwise accept reader-entered percentage progress; never infer a page total.
- Validate page and percentage bounds. Changing editions requires explicit confirmation or resetting progress before carrying measurements across.
- Support one active reading attempt per library entry. Reread history and audiobook-specific time tracking are deferred.
- Provide a way to stop reading without marking a book finished. Finalize the treatment of paused or unfinished books during B0.

### Private journal and public reviews

- Journal entries are private, optionally linked to a book, and support creation, editing, deletion, and explicit saving.
- Keep saved content intact when an update fails, preserve the local draft, and show a recoverable error. Add autosave only when its failure behavior is defined and verified.
- Public reviews are a separate publishing flow with explicit public wording, editing, deletion, spoiler marking, and reporting.
- Admins can review reports and hide or restore public reviews. Public publishing is not released before these moderation controls are available.
- Personal library activity and journal content are excluded from public responses, public search, metadata, and shared caches.

### Signature experience

Build the accessible cover grid first, then add the personal bookshelf as the main visual signature. Essential actions must remain available without hover, dragging, transforms, or animation. Add a compact list view if it improves scanning.

Use short transitions for cover lift, saved-state feedback, and progress changes; 120–220 ms is a starting range for prototypes. Journal page-turn animation is deferred.

## 6. Candidate technology baseline

Retain the original stack as a planning baseline. Validate current versions, service capabilities, and integration details before B2; this document does not claim those decisions have been technically verified.

- **Application:** Next.js App Router, React, TypeScript, Server Actions/Route Handlers.
- **Styling:** Tailwind CSS and a custom literary design system. Add Motion where needed; use restrained CSS depth for the shelf.
- **Database:** PostgreSQL, Neon hosting, Drizzle ORM and migrations; local PostgreSQL through Docker Compose.
- **Authentication:** select one provider after reviewing Better Auth and Neon Auth against the functional requirements. Launch with reader and admin roles and server-side authorization.
- **Forms and validation:** Zod and React Hook Form where appropriate.
- **Verification:** Vitest, React Testing Library, Playwright, and GitHub Actions, focused on meaningful workflows, ownership, privacy, and moderation.
- **Deployment and assets:** Vercel and optimized covers. Introduce managed file storage only if uploads enter scope.
- **External catalog:** evaluate Open Library or Google Books later against current terms, image usage, data quality, and rate limits. Integration is not a launch dependency.

## 7. Initial data domains

**MVP:** `users`, authentication-provider records, `profiles`, `books`, `book_editions`, `authors`, `book_authors`, `genres`, `book_genres`, `moods`, `book_moods`, `curated_lists`, `curated_list_books`, `shelf_entries`, `reading_progress`, `journal_entries`, `reviews`, `review_reports`, and `moderation_actions`.

`books` represents the work; `book_editions` represents a particular publication or format. Shelf entries are unique by user/work and store reading status plus favorite membership. Progress belongs to the user's library entry and, for page measurements, the selected edition. Enforce that the selected edition belongs to the same work.

Enforce ownership and roles on the server for every protected read and write. Define deletion behavior, review/rating cardinality, and moderation visibility in the functional specification before schema implementation.

**Later:** `reading_sessions`, reading-attempt history, `reading_goals`, `clubs`, `club_memberships`, `club_books`, and `club_posts`. Add these domains with their features.

## 8. Roadmap milestones

| Phase | Deliverable | Exit criteria |
|---|---|---|
| **B0 — Product definition** | Core journey, launch routes, library/edition rules, privacy, review behavior, and content plan | Functional specification resolves unfinished books, deletion behavior, progress transitions, and publishing/moderation rules. |
| **B1 — Literary design** | Tokens, typography, real content samples, four key page prototypes, and Journal editor | Desktop/mobile compositions are reviewed; long titles, empty states, loading, errors, and focus states are represented. |
| **B2 — Foundation** | App structure, database/migrations, chosen auth, seeds, and CI | Fresh setup runs reliably; ownership and role enforcement are verified. |
| **B3 — Discovery and catalog** | Home, catalog, search, genre/mood filters, details, and curated collections | Complete guest discovery works with credible content and responsive layouts. |
| **B4 — Reader essentials** | Library, favorites, progress, journal, and review workflow | Writes persist, save failures recover, edition rules hold, and private data remains private. Review publishing stays unavailable publicly until B5 is complete. |
| **B5 — Content and moderation** | Admin metadata/list management, reports, and review visibility controls | Admin workflows work; unauthorized writes fail; public review publishing can be enabled with moderation available. |
| **B6 — Signature and finish** | Bookshelf presentation, feedback, responsive refinement, and complete UI states | Core actions work in grid and shelf views, with keyboard and reduced motion. |
| **B7 — QA and launch** | Accessibility, security, performance, SEO, deployment, and setup guide | Deployed demo supports complete guest and signed-in journeys; critical issues are resolved. |
| **B8 — Case study** | Desktop/mobile screenshots, walkthrough, architecture, design decisions, and validation evidence | Visual craft and functional depth are clear and backed by working behavior. |
| **B9 — Expansion** | Prioritized clubs, challenges, sessions, statistics, and optional journal animation | Each feature has a clear user need, appropriate data rules, and moderation/privacy coverage. |

Accessibility, responsive behavior, security, and functional validation apply throughout development. B7 consolidates verification before launch.

## 9. Launch boundaries

**Included:** curated catalog, search, genre/mood discovery, book details, accounts, private library, independent favorites, edition-aware progress, private journal, public reviews with moderation, admin content tools, grid and bookshelf views, and a complete light theme.

**Deferred:** clubs, challenges, reading sessions/time tracking, advanced statistics, reread history, public profiles, social follows, advanced recommendations, external e-reader sync, audiobook time tracking, journal page-turn animation, dark theme, and marketplace transactions.

## 10. Acceptance checklist

- [ ] Guests can discover books and browse details with working navigation and preserved search state.
- [ ] Core screens share a consistent visual system and work on mobile and desktop.
- [ ] Covers, missing images, long titles, and incomplete metadata have intentional treatments.
- [ ] Loading, empty, error, pending, and success states are designed and implemented.
- [ ] Signed-in readers can add, update, and remove library entries with persisted state; favorites are independent of status.
- [ ] Page progress uses the selected edition; unknown page counts use percentage progress; invalid values are rejected.
- [ ] Journal entries and library activity remain private; review publication is explicit.
- [ ] Review reporting, spoiler controls, and admin hide/restore actions work before public publishing is enabled.
- [ ] Protected routes, data access, and mutations enforce ownership and roles server-side.
- [ ] Shelf and grid views offer equivalent core actions with keyboard, touch, and reduced-motion support.
- [ ] Layouts handle zoom and long content; focus remains visible; dialogs and forms have usable labels and keyboard behavior.
- [ ] Text contrast meets 4.5:1 for normal text and 3:1 for qualifying large text. [W3C guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [ ] Touch controls target 44 × 44 CSS px for comfort; verify WCAG 2.2 AA minimum target sizing and applicable spacing/exception rules. [W3C guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [ ] Reduced motion disables nonessential movement as a product requirement. The specific interaction-animation criterion is Level AAA. [W3C guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [ ] Images reserve layout space and use appropriate sizes; below-the-fold assets load progressively.
- [ ] The deployed demo, English setup guide, and case study show a complete reader journey and honest content provenance.

Target WCAG 2.2 AA across the delivered experience. The selected checks above are not a substitute for a full accessibility review.

## 11. Next deliverables

1. **`THE_BOOK_NOOK_FUNCTIONAL_SPEC.md`:** explicit library/status transitions, edition/progress rules, journal privacy and saving, review publishing/moderation, schema constraints, and acceptance criteria.
2. **`THE_BOOK_NOOK_DESIGN_SPEC.md`:** finalized tokens, typography, components, page layouts, responsive behavior, and UI states, informed by prototypes.
3. **Visual prototypes:** Home, Discover, Book Details, and My Library on desktop and mobile, plus the Journal editor.
4. **Implementation backlog:** tasks grouped by B2–B7 with dependencies and verifiable outcomes.

## 12. Changes from v0.1

- Established the warm, elegant library direction and English language requirement.
- Added an initial design system, concrete page compositions, content targets, and visual acceptance criteria.
- Simplified launch navigation and moved active reading into My Library and public reviews onto book pages.
- Separated favorites from reading status and brought edition handling into MVP planning.
- Moved manually tagged mood discovery into catalog development.
- Selected the bookshelf as the signature interaction and deferred journal page turns.
- Added review reporting and moderation as prerequisites for public publishing.
- Moved launch and the case study ahead of community and statistics expansion.
