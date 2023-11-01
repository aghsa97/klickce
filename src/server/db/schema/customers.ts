import { relations } from "drizzle-orm";
import {
  boolean,
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

export const plan = ["BASIC", "PRO"] as const;

export const customers = mysqlTable(
  "customers",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),

    clerkUesrId: varchar("clerkUesrId", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    onTrial: boolean("on_trial").default(false),

    stripeId: varchar("stripe_id", { length: 256 }).unique(),
    subscriptionId: text("subscription_id"),
    subPlan: mysqlEnum("SubPlan", plan),
    paidUntil: timestamp("paid_until"),
    endsAt: timestamp("ends_at"),

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
  projects: many(projects),
  spots: many(spots),
  maps: many(maps),
}));

export const insertCustomerSchema = createInsertSchema(customers);
export const selectCustomerSchema = createSelectSchema(customers).pick({
  subPlan: true,
  paidUntil: true,
  endsAt: true,
  onTrial: true,
});
export const updateCustomerSchema = selectCustomerSchema;

export type Customer = z.infer<typeof selectCustomerSchema>;
export type NewCustomer = z.infer<typeof insertCustomerSchema>;
