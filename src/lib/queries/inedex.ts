import { eq } from "drizzle-orm";
import { db } from "../db";
import { maps } from "../db/schema/maps";
import { auth } from "@clerk/nextjs";

export async function getCustomerMaps() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not found");
  }
  const res = await db
    .select()
    .from(maps)
    .where(eq(maps.ownerId, userId))
    .execute();
  return res;
}
