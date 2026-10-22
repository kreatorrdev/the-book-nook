"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main className="loading-page"><span className="eyebrow">A MOMENT BETWEEN CHAPTERS</span><h1>We lost our place.</h1><p>Your saved reading life is still yours. Please try loading this page again.</p><button className="button primary" onClick={reset}>Try again</button></main>; }
