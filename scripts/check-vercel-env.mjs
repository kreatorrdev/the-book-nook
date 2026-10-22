// Validate hosting settings without printing connection strings or secrets.
const problems = [];
const database = process.env.DATABASE_URL;
if (!database) {
  problems.push("Set DATABASE_URL to the hosted PostgreSQL connection string.");
} else {
  try {
    const url = new URL(database);
    if (!["postgres:", "postgresql:"].includes(url.protocol) || !url.hostname || ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
      problems.push("DATABASE_URL must point to hosted PostgreSQL, not this computer.");
    }
  } catch {
    problems.push("DATABASE_URL must be a valid PostgreSQL connection URL.");
  }
}

if (!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.trim().length < 32) {
  problems.push("Set BETTER_AUTH_SECRET to a stable, random secret of at least 32 characters.");
}

try {
  const origin = process.env.BETTER_AUTH_URL;
  const url = new URL(origin || "");
  if (url.protocol !== "https:" || origin !== url.origin || url.username || url.password) {
    problems.push("BETTER_AUTH_URL must be the exact public HTTPS origin, without a path or trailing slash.");
  }
} catch {
  problems.push("Set BETTER_AUTH_URL to the exact public HTTPS origin.");
}

if (process.env.ALLOW_LOCAL_DATABASE) {
  problems.push("Remove ALLOW_LOCAL_DATABASE from Vercel; it is only for the local preview.");
}
if (process.env.BOOK_NOOK_MIGRATE === "1") {
  problems.push("Remove BOOK_NOOK_MIGRATE from Vercel; run migrations once as a release step.");
}

if (problems.length) {
  console.error("Vercel deployment settings need attention:\n" + problems.map(problem => `- ${problem}`).join("\n"));
  process.exit(1);
}
console.log("Vercel environment settings are valid. Apply the database migration before publishing.");
