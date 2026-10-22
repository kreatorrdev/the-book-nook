// Disposable, localhost-only fixture for checking the real browser interface.
// No public reviews are seeded. Cleanup deletes only this fixture's own account.
const origin = "http://localhost:3000";
const email = "booknook-ui-check@example.test";
const password = "BookNookInterfaceCheck2026!";
let cookie = "";
async function call(endpoint, body) {
  const response = await fetch(origin + endpoint, { method: "POST", headers: { origin, cookie, "content-type": "application/json" }, body: JSON.stringify(body) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || result.message || "Fixture request failed");
  const cookies = response.headers.getSetCookie();
  if (cookies.length) cookie = cookies.map(value => value.split(";")[0]).join("; ");
  return result;
}
if (process.argv[2] === "cleanup") {
  await call("/api/auth/sign-in/email", { email, password });
  await call("/api/auth/delete-user", { password });
  console.log("Removed the disposable browser-check account and its reading data.");
} else {
  await call("/api/auth/sign-up/email", { email, password, name: "Interface Check" });
  for (const entry of [
    { bookId: "the-secret-garden", status: "reading", progress: 35, favorite: true },
    { bookId: "pride-and-prejudice", status: "want", favorite: true },
    { bookId: "the-great-gatsby", status: "read" },
    { bookId: "walden", status: "want" },
  ]) await call("/api/reader", { action: "library", ...entry });
  console.log("Disposable localhost browser-check account and four library entries are ready.");
}
