import { relations } from "drizzle-orm";
import {
  double,
  index,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { customers } from "./customers";
import { maps } from "./maps";
import { projects } from "./projects";

export const spots = mysqlTable(
  "spots",
  {
    id: varchar("id", { length: 30 }).primaryKey(), // prefix_ + nanoid(16)
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),

    name: text("name").notNull(),
    address: text("address").notNull(),
    lat: double("lat").notNull(),
    lng: double("lng").notNull(),
    color: varchar("color", { length: 7 }).notNull().default("#3b82f6"), // blue-500

    description: text("description").notNull().default(""),

    mapId: varchar("mapId", { length: 30 }).notNull(),
    projectId: varchar("projectId", { length: 30 }).notNull().default(""), // empty string means no project
    ownerId: varchar("ownerId", { length: 50 }).notNull(),
  },
  (table) => {
    return {
      spotIdIndex: index("spot_id_index").on(table.id),
      spotMapIdIndex: index("spot_mapId_index").on(table.mapId),
      spotProjectIdIndex: index("spot_projectId_index").on(table.projectId),
      spotOwnerIdIndex: index("spot_ownerId_index").on(table.ownerId),
    };
  },
);

export const spotsRelations = relations(spots, ({ one }) => ({
  map: one(maps, {
    fields: [spots.mapId],
    references: [maps.id],
  }),
  project: one(projects, {
    fields: [spots.projectId],
    references: [projects.id],
  }),
  owner: one(customers, {
    fields: [spots.ownerId],
    references: [customers.clerkUesrId],
  }),
}));

export const insertSpotSchema = createInsertSchema(spots).omit({
  id: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
});

export const selectSpotSchema = createSelectSchema(spots).omit({
  ownerId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSpotSchema = createInsertSchema(spots)
  .pick({
    id: true,
    name: true,
    color: true,
    description: true,
    projectId: true,
  })
  .partial({
    name: true,
    color: true,
    description: true,
    projectId: true,
  });

export const spotIdSchema = selectSpotSchema.pick({ id: true });

export type Spot = z.infer<typeof selectSpotSchema>;
export type NewSpot = z.infer<typeof insertSpotSchema>;
export type SpotId = z.infer<typeof spotIdSchema>["id"];
