import { relations } from "drizzle-orm";
import { index, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { customers } from "./customers";
import { spots } from "./spots";

export const images = mysqlTable(
  "images",
  {
    id: varchar("id", { length: 30 }).primaryKey(), // prefix_ + nanoid(16)
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),

    publicId: varchar("publicId", { length: 150 }).notNull().unique(),

    spotId: varchar("spotId", { length: 30 }).notNull(),
    ownerId: varchar("ownerId", { length: 50 }).notNull(),
  },
  (table) => {
    return {
      spotIdIndex: index("spotId_index").on(table.spotId),
      publicIdIndex: index("publicId_index").on(table.publicId),
      ownerIdIndex: index("ownerId_index").on(table.ownerId),
    };
  },
);

export const imagesRelations = relations(images, ({ one }) => ({
  spot: one(spots, {
    fields: [images.spotId],
    references: [spots.id],
  }),
  owner: one(customers, {
    fields: [images.ownerId],
    references: [customers.clerkUesrId],
  }),
}));

export const selectImageSchema = createSelectSchema(images).pick({
  id: true,
  spotId: true,
  publicId: true,
});

export const insertImageSchema = createInsertSchema(images).pick({
  id: true,
  spotId: true,
  publicId: true,
});
export const updateImageSchema = createInsertSchema(images).pick({
  spotId: true,
  publicId: true,
});
export const imageIdSchema = selectImageSchema.pick({ id: true });

export type Image = z.infer<typeof selectImageSchema>;
export type NewImage = z.infer<typeof insertImageSchema>;
export type ImageId = z.infer<typeof imageIdSchema>["id"];
