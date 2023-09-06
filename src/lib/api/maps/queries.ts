import { sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { maps } from "@/lib/db/schema/maps";

export const getMapsCount = async () => {
  const [count] = await db
    .select({ count: sql<number>`count(*)` })
    .from(maps)
    .execute();

  return count;
};
export const getViewsCount = async () => {
  const [count] = await db
    .select({ count: sql<number>`SUM(views)` })
    .from(maps)
    .execute();

  return count;
};
