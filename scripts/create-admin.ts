import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import { user } from "../src/db/schema";
for (const file of [".env", ".env.local"]) { try { process.loadEnvFile(file); } catch {} }
async function main() {
  const prompt = createInterface({ input: stdin, output: stdout });
  const email = (await prompt.question("Email of an existing account to make an administrator: ")).trim().toLowerCase(); prompt.close();
  const db = await getDb();
  const result = await db.update(user).set({ role: "admin", updatedAt: new Date() }).where(eq(user.email, email)).returning({ id: user.id });
  if (!result.length) throw new Error("No account with that email. Create the reader account first.");
  console.log("Administrator access granted. Sign in again and open /admin."); process.exit(0);
}
main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
