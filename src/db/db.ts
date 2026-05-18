// import { auth } from "@clerk/nextjs/server";
// import { Pool } from "pg";
import { neon, NeonQueryFunction } from "@neondatabase/serverless";
// import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";

import { attachDatabasePool } from "@vercel/functions";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { Pool } from "pg";

dotenv.config({
  path: ".env.local",
});

const jwksURL = new URL(process.env.CLERK_JWKS_DEV_URL!);

const globalForPool = globalThis as unknown as { pool: Pool };

if (!globalForPool.pool) {
  globalForPool.pool = new Pool({
    connectionString: process.env.NEON_APP_USER_DB_URL!,
    idleTimeoutMillis: 5000,
  });
}

// const globalForDb = globalThis as unknown as {
//   client: Pool | undefined;
// };

// const client =
//   globalForDb.client ??
//   new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });

// if (process.env.NODE_ENV !== "production") globalForDb.client = client;

attachDatabasePool(globalForPool.pool);

export const db = drizzle(globalForPool.pool);

// export const verifyAuth = async (): Promise<any> => {
//   try {
//     const { getToken, userId } = await auth();
//     const token = await getToken();
//     if (!token || !userId) {
//       throw new Error("Authentication is required.");
//     }

//     const { payload } = await jwtVerify(token, createRemoteJWKSet(jwksURL));
//     const claims = JSON.stringify(payload);
//     return { userId, claims };
//   } catch (error) {
//     console.error("JWT Verification failed:", error);
//     throw new Error("Invalid authentication token.");
//   }
// };
