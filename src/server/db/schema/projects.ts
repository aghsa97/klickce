import { relations } from "drizzle-orm";
import {
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  index,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { customers } from "./customers";
import { maps } from "./maps";
import { spots } from "./spots";

export const projects = mysqlTable(
  "projects",
  {
    id: varchar("id", { length: 30 }).primaryKey(), // prefix_ + nanoid(16)
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),

    name: text("name").notNull(),
    isVisible: boolean("isVisible").notNull().default(true),
    color: varchar("color", { length: 7 }).notNull().default("#eab308"),

    mapId: varchar("mapId", { length: 30 }).notNull(),
    ownerId: varchar("ownerId", { length: 50 }).notNull(),
  },
  (table) => {
    return {
      projectIdIndex: index("project_id_index").on(table.id),
      projectMapIdIndex: index("project_mapId_index").on(table.mapId),
      projectOwnerIdIndex: index("project_ownerId_index").on(table.ownerId),
    };
  },
);

export const projectsRelations = relations(projects, ({ many, one }) => ({
  spots: many(spots),
  map: one(maps, {
    fields: [projects.mapId],
    references: [maps.id],
  }),
  owner: one(customers, {
    fields: [projects.ownerId],
    references: [customers.clerkUesrId],
  }),
}));

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  mapId: true,
});
export const selectProjectSchema = createSelectSchema(projects).omit({
  ownerId: true,
  createdAt: true,
  updatedAt: true,
});
export const updateProjectSchema = createInsertSchema(projects)
  .pick({
    id: true,
    name: true,
    color: true,
    isVisible: true,
  })
  .partial({
    name: true,
    color: true,
    isVisible: true,
  });
export const projectIdSchema = selectProjectSchema.pick({ id: true });

export type Project = z.infer<typeof selectProjectSchema>;
export type NewProject = z.infer<typeof insertProjectSchema>;
export type ProjectId = z.infer<typeof projectIdSchema>["id"];
