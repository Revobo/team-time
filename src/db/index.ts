import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDbInstance() {
  if (!db) {
    console.info("Initializing database connection...");
    db = drizzle({
      connection: {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT!),
        database: process.env.DB_NAME!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
      },
      schema,
    });
  }
  return db;
}

export { schema };
