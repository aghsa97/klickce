import { mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const spots = mysqlTable("spots", {
  id: varchar("id", { length: 30 }).primaryKey(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),

  name: text("name").notNull(),
  address: text("address").notNull(),
  lat: text("lat").notNull(),
  lng: text("lng").notNull(),

  description: text("description").default(""),
});

export const insertSpotSchema = createInsertSchema(spots);
export const selectSpotSchema = createSelectSchema(spots);
export const spotIdSchema = selectSpotSchema.pick({ id: true });
export const updateSpotSchema = selectSpotSchema;

export type Spot = z.infer<typeof selectSpotSchema>;
export type NewSpot = z.infer<typeof insertSpotSchema>;
export type SpotId = z.infer<typeof spotIdSchema>["id"];
