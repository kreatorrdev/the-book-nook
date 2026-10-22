# The Book Nook — Functional specification

Implementation baseline: roadmap v0.2. Updated 2026-10-20.

## Ownership and access

Guests browse the Reading Room, Discover, and available book details. Library, journal, profile, and settings require a database-backed session. The intended path and query are carried through sign-in. `/admin` and its API require a server-verified `admin` role; registration always creates `reader` accounts.

Every protected mutation gets its owner from the session rather than the request body. Journal and review edits/deletes include the owner in their database predicate. Reader mutations reject a mismatched Origin. Private responses use `private, no-store`; rendered pages are dynamic. Public review projections omit owner identifiers, email addresses, shelves, profiles, and journal content.

## Library and editions

One shelf entry exists per user/work. Status is `want`, `reading`, or `read`. Favorite membership is an independent boolean. Favoriting a work outside the library opens the status selector. A `paused` flag is allowed only with `reading`; it retains progress and removes the book from the home page's active-reading prompts.

| Transition | Behavior |
| --- | --- |
| Add to Want to read | Zero percent, unspecified edition unless selected. |
| Want to read → Currently reading | Begins the active attempt at zero. |
| Currently reading → Read | Explicitly finishes the attempt; sets 100% or the exact edition page count. |
| Read → Currently reading/Want to read | Requires progress-reset confirmation. History is outside this release. |
| Reading → Want to read | Requires confirmation if progress exists, then resets to zero. |
| Pause/resume | Keeps status and progress; never implies completion. |
| Remove from library | Deletes only the shelf record. Linked journal entries and reviews remain. |

Percentage progress is an integer from 0–100. Page progress is an integer from zero to the selected edition's known page total. The edition must belong to the same work, enforced both by the API and a composite database foreign key. Unknown page totals never receive an inferred number.

Changing editions with recorded progress requires an explicit reset acknowledgement. Changing the measurement unit in the interface resets its value after confirmation. Reaching 100% while still reading does not silently mark the book Read. Completion is a separate status decision.

Every seeded work has an unspecified edition with unknown page count. One Penguin Classics edition of Pride and Prejudice demonstrates page-based progress; its metadata source is recorded in the content inventory. Catalog withdrawal keeps existing owners' book metadata available through their own library/journal/review references, while excluding it from public discovery.

## Private writing

Journal entries have a required title and body and an optional linked book. Saving is explicit. Unsaved content is kept in tab-scoped session storage under an owner-specific key for recovery; this is draft recovery, not server autosave. Sign-out clears these local journal drafts.

Navigation and tab closing warn when unsaved edits exist. A failed save leaves the editor's text and previous database record intact. Updates compare the saved `updatedAt` version and use a database compare-and-swap predicate; stale windows cannot silently overwrite a newer entry. The reader can reload the saved version while retaining a recoverable local draft.

Deleting an entry requires explicit confirmation and is permanent. Account deletion removes all private writing. Journal content is never reused to prefill or automatically create a public review.

## Public reviews and moderation

Publishing requires at least one administrator account, a valid session, an explicit public-consent flag, a 1–5 integer rating, and 20–5,000 characters. One review exists per reader/work. Only visible reviews contribute to the displayed rating/count. No seeded community ratings or testimonials are presented.

Authors can edit/delete their own review. A spoiler flag conceals its body until another reader chooses to reveal it. Signed-in readers can report another visible review with a reason. A unique reader/review report constraint prevents duplicate reports.

Administrators can inspect reports, resolve them, and hide/restore reviews. Hide and restore actions are logged in an audit table. Editing a hidden review does not restore visibility. Only its owner and administrators can see a hidden review. Deleting an account removes its reviews and reports; moderation audit records survive with nullable references.

## Content and account tools

Administrators edit existing titles, author display text, genre, mood tags, original description, featured/listed state, and collection introductions/membership. Unlisting is reversible. Physical work deletion and arbitrary uploads are intentionally not exposed.

Profiles are private. Only a display name is attached to a deliberately published review. Preferences remember the grid/bookshelf view. Better Auth handles hashed passwords, sessions, authenticated password changes, session revocation, and confirmed account deletion. A trusted command grants administrator status to an existing account, never through a client field or shared password.

## Acceptance evidence

Automated integration tests verify actual authentication and database behavior, two-reader isolation, progress/edition limits, stale journal writes, public consent and moderation prerequisites, hidden-review visibility, catalog withdrawal retention, and account deletion. Responsive and keyboard behavior require browser checks in addition to these tests. Hosted PostgreSQL and full WCAG validation remain launch tasks.
