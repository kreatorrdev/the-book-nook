import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

const origin = "https://the-book-nook-wine.vercel.app";
const cookies = new Map();
const results = [];
const check = (condition, message) => { assert.ok(condition, message); results.push(message); console.log(`PASS ${message}`); };

async function request(endpoint, body, authenticated = false) {
  const response = await fetch(origin + endpoint, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      ...(body === undefined ? {} : { origin, "content-type": "application/json" }),
      ...(authenticated ? { cookie: [...cookies].map(([key, value]) => `${key}=${value}`).join("; ") } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (authenticated || endpoint === "/api/auth/sign-up/email") {
    for (const value of response.headers.getSetCookie()) {
      const pair = value.split(";")[0];
      const divider = pair.indexOf("=");
      cookies.set(pair.slice(0, divider), pair.slice(divider + 1));
    }
  }
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = null; }
  return { response, text, data };
}

let created = false;
const marker = randomBytes(10).toString("hex");
const email = `deployment-check-${marker}@example.test`;
const password = randomBytes(24).toString("base64url");

try {
  const home = await request("/");
  check(home.response.status === 200 && home.text.includes("gothic-cathedral-game.webp"), "public home serves the latest hero without Vercel authentication");
  for (const [path, size, type] of [
    ["/images/gothic-cathedral-game.webp", 411822, "image/webp"],
    ["/images/gothic-cathedral-game-mobile.webp", 129222, "image/webp"],
    ["/images/gothic-archive.webp", 451830, "image/webp"],
    ["/images/gothic-cathedral.webp", 387046, "image/webp"],
    ["/images/reading-desk.webp", 329164, "image/webp"],
    ["/social-preview.jpg", 170713, "image/jpeg"],
  ]) {
    const image = await fetch(origin + path);
    const bytes = Buffer.from(await image.arrayBuffer());
    const signature = type === "image/webp" ? bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" : bytes.length > 2 && bytes.readUInt16BE(0) === 0xffd8;
    check(image.ok && image.headers.get("content-type")?.includes(type) && bytes.length === size && signature, `${path} serves the expected public image`);
  }
  const canonical = home.text.match(/<link rel="canonical" href="([^"]+)"/);
  check(canonical && new URL(canonical[1]).href === new URL(origin).href && home.text.includes('property="og:image"'), "home publishes canonical and social-sharing metadata");
  const robots = await request("/robots.txt");
  const sitemap = await request("/sitemap.xml");
  check(robots.response.ok && robots.text.includes("Disallow: /journal") && sitemap.response.ok && sitemap.text.includes(`${origin}/discover`), "robots and sitemap describe the public editorial entry points");
  const signIn = await request("/sign-in");
  check(signIn.response.ok && /name="robots" content="noindex, nofollow"/.test(signIn.text), "authentication pages are excluded from indexing");
  const guest = await request("/api/reader");
  check(guest.response.ok && guest.data?.books?.length === 40 && guest.data.collections.length === 5 && !guest.data.reader, "hosted PostgreSQL serves all 40 books and five collections");
  const book = guest.data.books.find(book => book.slug === "walden") || guest.data.books[0];
  const detail = await request(`/books/${book.slug}`);
  check(detail.response.ok && detail.text.includes(book.title), "public book route renders");
  const signup = await request("/api/auth/sign-up/email", { name: "Temporary deployment check", email, password });
  check(signup.response.ok && signup.data?.user?.id && cookies.size > 0, "production sign-up creates a working secure session");
  created = true;
  const signedOut = await request("/api/auth/sign-out", {}, true);
  check(signedOut.response.ok, "production sign-out revokes the verification session");
  cookies.clear();
  const signedIn = await request("/api/auth/sign-in/email", { email, password }, true);
  check(signedIn.response.ok && cookies.size > 0, "production password sign-in creates a fresh session");
  const shelf = await request("/api/reader", { action: "library", bookId: book.id, status: "reading", progress: 15 }, true);
  check(shelf.response.ok && shelf.data?.data?.shelves?.some(entry => entry.bookId === book.id && entry.progress === 15), "private shelf changes persist in hosted PostgreSQL");
  const journal = await request("/api/reader", { action: "save-journal", bookId: book.id, title: "Temporary deployment verification", body: `Private verification entry ${marker}.` }, true);
  check(journal.response.ok && journal.data?.data?.journals?.some(entry => entry.body.includes(marker)), "private journal changes persist in hosted PostgreSQL");
  const saved = await request("/api/reader", undefined, true);
  check(saved.response.ok && saved.data.reader?.id === signup.data.user.id && saved.data.journals.some(entry => entry.body.includes(marker)), "session and private records survive an independent request");
  const publicSnapshot = await request("/api/reader");
  check(publicSnapshot.response.ok && !publicSnapshot.text.includes(marker) && publicSnapshot.data.shelves.length === 0 && publicSnapshot.data.journals.length === 0, "guest responses exclude the temporary reader's private records");
} finally {
  if (created) {
    const removed = await request("/api/auth/delete-user", { password }, true);
    check(removed.response.ok, "temporary verification account and its private records were removed");
  }
}

console.log(JSON.stringify({ origin, passed: results.length }));
