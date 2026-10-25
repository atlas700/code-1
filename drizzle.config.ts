import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";
import { validateDatabaseUrl } from "./src/db/environment";

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: { url: validateDatabaseUrl(process.env.DATABASE_URL) },
});
