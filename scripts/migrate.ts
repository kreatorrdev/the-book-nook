import { getDb } from "../src/db";
for (const file of [".env", ".env.local"]) { try { process.loadEnvFile(file); } catch {} }
process.env.BOOK_NOOK_MIGRATE = "1";
async function main() { await getDb(); console.log("PostgreSQL schema and curated catalog are ready."); process.exit(0); }
main().catch(error => { console.error(error); process.exit(1); });
