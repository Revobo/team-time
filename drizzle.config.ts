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
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    database: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
  },
});
