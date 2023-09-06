import { db } from "@/lib/db";
import { insertMapSchema, maps, NewMap } from "@/lib/db/schema/maps";

export const createMap = async (map: NewMap) => {
  const newMap = insertMapSchema.parse(map);
  try {
    return await db.insert(maps).values(newMap);
  } catch (err) {
    return { error: (err as Error).message ?? "Error, please try again" };
  }
};
