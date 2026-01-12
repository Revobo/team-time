import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDbInstance() {
  if (!db) {
    console.info("Initializing database connection...");
    db = drizzle({
      connection: {
        host: process.env.DB_HOST ?? "localhost",
        port: Number(process.env.DB_PORT ?? 5432),
        database: process.env.DB_NAME ?? "team_time",
        user: process.env.DB_USER ?? "postgres",
        password: process.env.DB_PASSWORD ?? "postgres",
      },
      schema,
    });
  }
  return db;
}

export { schema };
