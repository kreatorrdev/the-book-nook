import Link from "next/link";
export default function NotFound() { return <main className="loading-page"><span className="eyebrow">PAGE 404</span><h1>A page out of place.</h1><p>This book or page isn't on our shelves. Let's find you another story.</p><Link className="button primary" href="/discover">Back to the books</Link></main>; }
