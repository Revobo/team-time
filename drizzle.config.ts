import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

const nodeEnv = process.env.NODE_ENV ?? "development";

config({ path: `./.env.${nodeEnv}` });
console.log(`📦 Drizzle Config: Loading environment for ${nodeEnv}`);

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  verbose: true,
  dbCredentials: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? "team_time",
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
  },
});
