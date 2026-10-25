import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/env";

function createPool() {
  const pool = new Pool({ connectionString: env.databaseUrl });
  pool.on("error", () => {
    console.error("Database pool connection failed. Check database availability.");
  });
  return pool;
}

const databaseGlobal: typeof globalThis & { afcsDatabasePool?: Pool } = globalThis;
const pool = databaseGlobal.afcsDatabasePool ?? createPool();

if (env.nodeEnvironment === "development") databaseGlobal.afcsDatabasePool = pool;

export const db = drizzle({ client: pool });
