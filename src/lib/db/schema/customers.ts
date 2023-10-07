import { relations } from "drizzle-orm";
import {
  index,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { maps } from "./maps";
import { projects } from "./projects";
import { spots } from "./spots";

export const plan = ["BASIC", "PRO", "ENTERPRISE"] as const;

export const customers = mysqlTable(
  "customers",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),

    clerkUesrId: varchar("clerkUesrId", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 256 }).notNull().unique(),

    stripeId: varchar("stripe_id", { length: 256 }).unique(),
    subscriptionId: text("subscription_id"),
    SubPlan: mysqlEnum("SubPlan", plan),
    endsAt: timestamp("ends_at"),
    paidUntil: timestamp("paid_until"),

    name: text("name").default(""),
  },
  (table) => {
    return {
      customerClerkUesrIdIndex: index("customer_clerkUesrId_index").on(
        table.clerkUesrId,
      ),
    };
  },
);

export const customersRelations = relations(customers, ({ many }) => ({
  maps: many(maps),
  projects: many(projects),
  spots: many(spots),
}));

export const insertCustomerSchema = createInsertSchema(customers);
export const selectCustomerSchema = createSelectSchema(customers).extend({
  plan: z
    .enum(plan)
    .default("BASIC")
    .transform((val) => val ?? "BASIC"),
});
export const customerClerkIdSchema = selectCustomerSchema.pick({
  clerkUesrId: true,
});
export const updateCustomerSchema = selectCustomerSchema;

export type Customer = z.infer<typeof selectCustomerSchema>;
export type NewCustomer = z.infer<typeof insertCustomerSchema>;
export type CustomerClerkId = z.infer<
  typeof customerClerkIdSchema
>["clerkUesrId"];
