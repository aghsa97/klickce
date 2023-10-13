import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { customers } from "./customers";
import { projects } from "./projects";
import { spots } from "./spots";

export const maps = mysqlTable(
  "maps",
  {
    id: varchar("id", { length: 30 }).primaryKey(), // prefix_ + nanoid(16)
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),

    name: varchar("name", { length: 30 }).notNull(),
    views: int("views").notNull().default(0),
    isPublic: boolean("isPublic").notNull().default(true),

    style: text("style").notNull().default("clnnkq3bb009q01plcj234b9v"),
    description: text("description").notNull().default(""),

    isUserCurrentLocationVisible: boolean("isUserCurrentLocationVisible")
      .notNull()
      .default(false),
    hasLandingPage: boolean("hasLandingPage").notNull().default(false),
    isAccessible: boolean("isAccessible").notNull().default(true),
    ownerId: varchar("ownerId", { length: 50 }).notNull(),
  },
  (table) => {
    return {
      mapIdIndex: index("map_id_index").on(table.id),
      ownerIdIndex: index("ownerId_index").on(table.ownerId),
      viewsIndex: index("views_index").on(table.views),
    };
  },
);

export const mapsRelations = relations(maps, ({ many, one }) => ({
  projects: many(projects),
  spots: many(spots),
  owner: one(customers, {
    fields: [maps.ownerId],
    references: [customers.clerkUesrId],
  }),
}));

export const insertMapSchema = createInsertSchema(maps).pick({
  name: true,
  style: true,
  description: true,
});

export const selectMapSchema = createSelectSchema(maps).omit({
  isAccessible: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});
export const mapIdSchema = selectMapSchema.pick({ id: true });
export const updateMapSchema = selectMapSchema
  .pick({
    id: true,
    name: true,
    style: true,
    isPublic: true,
    description: true,
    isUserCurrentLocationVisible: true,
  })
  .partial({
    name: true,
    style: true,
    isPublic: true,
    description: true,
    isUserCurrentLocationVisible: true,
  });

export type Map = z.infer<typeof selectMapSchema>;
export type NewMap = z.infer<typeof insertMapSchema>;
export type MapId = z.infer<typeof mapIdSchema>["id"];
