import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "../db";
import * as schema from "../db/schema";
import { randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
function secret() {
  if (process.env.BETTER_AUTH_SECRET) return process.env.BETTER_AUTH_SECRET;
  if (process.env.NODE_ENV === "production") throw new Error("BETTER_AUTH_SECRET is required in production.");
  const root = path.resolve(".data"); mkdirSync(root, { recursive: true });
  const file = path.join(root, "auth-secret");
  try { return readFileSync(file, "utf8"); } catch {
    const value = randomBytes(48).toString("base64url");
    try { writeFileSync(file, value, { flag: "wx", mode: 0o600 }); return value; } catch { return readFileSync(file, "utf8"); }
  }
}
const holder = globalThis as unknown as { nookAuth?: ReturnType<typeof initializeAuth> };
async function initializeAuth() {
  return betterAuth({
    appName: "The Book Nook", secret: secret(), baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    database: drizzleAdapter(await getDb(), { provider: "pg", schema }),
    emailAndPassword: { enabled: true, minPasswordLength: 10, maxPasswordLength: 128 },
    user: { additionalFields: { role: { type: "string", defaultValue: "reader", input: false } }, deleteUser: { enabled: true } },
    rateLimit: { enabled: true, window: 60, max: 30 },
  });
}
export function getAuth() { return holder.nookAuth ??= initializeAuth(); }
export async function readerSession(headers: Headers) { return (await getAuth()).api.getSession({ headers }); }
