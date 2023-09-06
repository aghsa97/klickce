import {
  boolean,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const maps = mysqlTable("maps", {
  id: varchar("id", { length: 30 }).primaryKey(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),

  name: text("name").notNull(),
  mapUrl: text("mapUrl").notNull(),
  views: int("views").notNull().default(0),
  isPublic: boolean("isPublic").notNull().default(true),

  style: json("style").default({}),
  description: text("description").default(""),
});

export const insertMapSchema = createInsertSchema(maps);
export const selectMapSchema = createSelectSchema(maps);
export const mapIdSchema = selectMapSchema.pick({ id: true });
export const updateMapSchema = selectMapSchema;

export type Map = z.infer<typeof selectMapSchema>;
export type NewMap = z.infer<typeof insertMapSchema>;
export type MapId = z.infer<typeof mapIdSchema>["id"];
