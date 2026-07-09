// Applies db/schema.sql to DATABASE_URL. Run with: npm run db:push
// Requires .env.local to have DATABASE_URL set (Cloud SQL Postgres).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(path.join(__dirname, "schema.sql"), "utf8");

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";'); // for gen_random_uuid()
  await client.query(sql);
  console.log("Schema applied successfully.");
} catch (err) {
  console.error("Schema apply failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
