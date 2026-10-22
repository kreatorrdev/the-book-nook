import { PGlite } from "@electric-sql/pglite";
import { drizzle, type PgliteDatabase } from "drizzle-orm/pglite";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import * as schema from "./schema";
import { seedBooks, collections } from "../lib/catalog";
type Database = PgliteDatabase<typeof schema>;
const globalDb = globalThis as unknown as { nookDb?: Promise<Database>; nookClose?: () => Promise<void> };
export function getDb(): Promise<Database> {
  if (!globalDb.nookDb) globalDb.nookDb = initialize().catch(async error => { await closeDb(); throw error; });
  return globalDb.nookDb;
}
export async function closeDb() { await globalDb.nookClose?.(); globalDb.nookDb = undefined; globalDb.nookClose = undefined; }
async function initialize(): Promise<Database> {
  let db: Database;
  let exec: (sql: string) => Promise<unknown>;
  if (process.env.DATABASE_URL) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
    globalDb.nookClose = () => pool.end();
    db = pgDrizzle(pool, { schema }) as unknown as Database;
    exec = sql => pool.query(sql);
  } else {
    if (process.env.NODE_ENV === "production" && !process.env.ALLOW_LOCAL_DATABASE) throw new Error("Set DATABASE_URL for production, or explicitly set ALLOW_LOCAL_DATABASE=1 for a single-process local preview.");
    const directory = path.resolve(process.env.BOOK_NOOK_DATA_DIR || ".data/postgres");
    await mkdir(directory, { recursive: true });
    const client = new PGlite(directory);
    globalDb.nookClose = () => client.close();
    await client.waitReady;
    db = drizzle(client, { schema });
    exec = sql => client.exec(sql);
  }
  // Hosted instances never race to migrate during an incoming reader request.
  if (process.env.DATABASE_URL && process.env.BOOK_NOOK_MIGRATE !== "1") return db;
  const migration = await readFile(path.resolve("migrations/0001_initial.sql"), "utf8");
  await exec(migration);
  // Idempotent seed: editorial changes and reader data are never overwritten.
  await db.transaction(async tx => {
    for (const book of seedBooks) {
      await tx.insert(schema.books).values(book).onConflictDoNothing();
      await tx.insert(schema.editions).values({ id: `${book.id}-unspecified`, bookId: book.id, label: "My edition · page count unknown", format: "Unspecified", language: "Not specified", pages: null }).onConflictDoNothing();
    }
    // Exact edition example; other editions intentionally have no assumed page total.
    await tx.insert(schema.editions).values({ id: "pride-and-prejudice-penguin-2002", bookId: "pride-and-prejudice", label: "Penguin Classics · 2002 paperback", format: "Paperback", language: "English", identifier: "9780141439518", pages: 448 }).onConflictDoNothing();
    for (const collection of collections) await tx.insert(schema.curatedLists).values(collection).onConflictDoNothing();
  });
  return db;
}
