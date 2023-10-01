import { relations } from "drizzle-orm";
import {
  index,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { spots } from "./spots";

export const images = mysqlTable(
  "images",
  {
    id: varchar("id", { length: 30 }).primaryKey(), // prefix_ + nanoid(16)
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),

    publicId: text("publicId").notNull(),

    spotId: varchar("spotId", { length: 30 }).notNull(),
  },
  (table) => {
    return {
      spotIdIndex: index("spotId_index").on(table.spotId),
    };
  },
);

export const imagesRelations = relations(images, ({ one }) => ({
  spot: one(spots, {
    fields: [images.spotId],
    references: [spots.id],
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
