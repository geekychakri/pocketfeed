import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForPool = globalThis as unknown as { pool: Pool };

if (!globalForPool.pool) {
  globalForPool.pool = new Pool({
    connectionString: process.env.NEON_APP_USER_DB_URL!,
    idleTimeoutMillis: 5000,
  });
}

attachDatabasePool(globalForPool.pool);

export const db = drizzle(globalForPool.pool);
