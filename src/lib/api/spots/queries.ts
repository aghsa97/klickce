import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { spots } from "@/lib/db/schema/sppts";

export const getSpotsCount = async () => {
  const [count] = await db
    .select({ count: sql<number>`count(*)` })
    .from(spots)
    .execute();

  return count;
};
