import { Pool } from "pg";

// Cloud SQL for PostgreSQL. In production on Vercel, connect via the
// Cloud SQL public IP + SSL, or the Cloud SQL Auth Proxy sidecar if
// deploying the agent service on Cloud Run instead.
let pool: Pool | null = null;

export function getDb(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
      max: 5,
    });
  }
  return pool;
}
