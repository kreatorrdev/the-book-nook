# Final portfolio quality report

Date: 2026-10-22. Scope: the deployed portfolio demo at https://the-book-nook-wine.vercel.app.

## Changes delivered

- Server execution is configured in Frankfurt (`fra1`), next to the Neon database. The live response changed from `fra1::iad1` to `fra1::fra1` in the Vercel region header.
- Secondary screens use conditional dynamic imports with server rendering retained. The home no longer imports the account, journal, personal-library, discovery, and administrator modules synchronously.
- Phones up to 430 px receive a dedicated crop of the existing hero: **129,222 bytes**, compared with **411,822 bytes** for the landscape original, a **68.6% reduction**. The original architecture and visual direction remain intact.
- Navigation can be dismissed with Escape and returns focus to its toggle. Mobile navigation exposes its controlled region and current destination. The skip link targets a focusable main landmark.
- Public pages provide canonical URLs and Open Graph/Twitter previews. Authentication/private pages request no indexing. Robots rules and a sitemap identify the public editorial entry points.
- The case study, portfolio copy, deployment record, documentation index, and verification instructions are maintained in English.
- All original photographic assets are included in the private source repository. A build preflight validates their file signatures before Next.js builds; live checks verify each asset's media type, size, and image signature.

## Functional checks

The production verification command is `npm run test:production`. It is a manual release check and is not part of the ordinary CI suite. It creates one uniquely named temporary reader, uses only that reader's private records, and removes the account afterward.

All **20 live checks** passed: home; all five WebP images and the JPEG social preview; canonical/social metadata; robots/sitemap; noindex on authentication pages; 40 books/five collections from hosted PostgreSQL; a book detail route; sign-up; sign-out; password sign-in; shelf persistence; journal persistence; session persistence; exclusion of private data from guest responses; and temporary-account cleanup.

GitHub Actions passed type checking, four domain tests, 39 isolated PostgreSQL integration checks, and a production build on Node.js 24. The optimized Vercel build also passed. A local standalone TypeScript 7 check exhausted the Windows host's available memory, so local success is not claimed for that attempt; the hosted checks supply the completed type/build verification.

## Performance measurement limits

The pre-change HTTP sample recorded home response headers after 1,576 ms on the first request, then 223 ms for Discover and 195 ms for Walden. These are small synthetic server-response samples, not browser rendering measurements or field Core Web Vitals. Cold starts, network conditions, and database wake-up affect the values.

Google PageSpeed Insights API returned HTTP 429 because its shared daily quota was exhausted. No Lighthouse score, LCP/INP/CLS result, accessibility score, or full WCAG compliance claim is fabricated. The asset-size reduction and deployment-region change are independently verified facts.

## Browser review

Chrome review verified the loaded desktop hero at 1440 × 900 and the 535-pixel-wide mobile crop at a 360 × 800 viewport. The home, catalog, and book page showed no horizontal overflow at the sampled 320/360-pixel widths. Escape dismissed mobile navigation and returned focus to its toggle; the skip link focused the main landmark. Searching for Walden returned one result with the query in the URL. The filter dialog opened with focus on Close and dismissed with Escape. The book animation reached the open title page on the loaded antique desk, removed its dialog, and released scroll locking. Sign-in fields exposed Email address and Password labels.

Current evidence is saved in `screenshots/final-home-desktop.png`, `final-home-mobile.png`, `final-discover-mobile.png`, and `final-book-mobile.png`. Older screenshots retain previous design and interaction iterations. This is a bounded portfolio review, not an independent screen-reader certification or a complete security audit.

## Optional work outside this demo

Email verification/password recovery require a configured mail provider. Public reviews remain closed until an administrator is provisioned. Wider operational monitoring, backups/recovery drills, and an independent assistive-technology/security audit are separate work for a broader service launch. The demo does not depend on local server uptime and contains no fabricated public reader activity.
