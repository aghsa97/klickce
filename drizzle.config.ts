import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/lib/db/schema/*",
  out: "./src/lib/db/drizzle",
  driver: "mysql2",
  dbCredentials: { connectionString: process.env.DATABASE_URL },
} as Config;
