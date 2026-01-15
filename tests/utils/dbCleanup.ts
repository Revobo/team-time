import { drizzle } from "drizzle-orm/node-postgres";
import { like } from "drizzle-orm";
import { events } from "../../server/db/schema";

const db = drizzle({
	connection: {
		host: process.env.DB_HOST ?? "localhost",
		port: Number(process.env.DB_PORT ?? 5432),
		database: process.env.DB_NAME ?? "team_time",
		user: process.env.DB_USER ?? "postgres",
		password: process.env.DB_PASSWORD ?? "postgres",
	},
});

export async function cleanupTestEvents() {
	await db.delete(events).where(like(events.name, "Test Event %"));
}
