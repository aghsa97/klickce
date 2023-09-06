import { db } from "@/lib/db";
import { insertSpotSchema, NewSpot, spots } from "@/lib/db/schema/sppts";

export const createSpot = async (spot: NewSpot) => {
  const newSpot = insertSpotSchema.parse(spot);
  try {
    return await db.insert(spots).values(newSpot);
  } catch (err) {
    return { error: (err as Error).message ?? "Error, please try again" };
  }
};
