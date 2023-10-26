import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { customAlphabet } from "nanoid";
import "dotenv/config";

import { schema } from "./schema";

const connection = connect({
  url: process.env.DATABASE_URL,
});

export const db = drizzle(connection, { schema });

export const genId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 16);
