import {
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = mysqlTable("customers", {
  id: varchar("id", { length: 30 }).primaryKey(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),

  clerkUesrId: varchar("clerkUesrId", { length: 50 }).notNull().unique(),

  SubPlan: mysqlEnum("SubPlan", ["FREE", "PAID"]).default("FREE"),

  name: text("name").default(""),
});

export const insertCustomerSchema = createInsertSchema(customers);
export const selectCustomerSchema = createSelectSchema(customers);
export const customerIdSchema = selectCustomerSchema.pick({ id: true });
export const updateCustomerSchema = selectCustomerSchema;

export type Customer = z.infer<typeof selectCustomerSchema>;
export type NewCustomer = z.infer<typeof insertCustomerSchema>;
export type CustomerId = z.infer<typeof customerIdSchema>["id"];
