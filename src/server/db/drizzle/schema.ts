import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, primaryKey, unique, serial, timestamp, varchar, mysqlEnum, text, int, tinyint, json, double } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"


export const customers = mysqlTable("customers", {
	id: serial("id").notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().onUpdateNow(),
	clerkUesrId: varchar("clerkUesrId", { length: 50 }).notNull(),
	subPlan: mysqlEnum("SubPlan", ['BASIC','PRO','ENTERPRISE']).default('BASIC').notNull(),
	name: text("name").default(sql`''`),
	endsAt: timestamp("ends_at", { mode: 'string' }),
	paidUntil: timestamp("paid_until", { mode: 'string' }),
	stripeId: varchar("stripe_id", { length: 256 }),
	subscriptionId: text("subscription_id"),
},
(table) => {
	return {
		customerClerkUesrIdIdx: index("customer_clerkUesrId_index").on(table.clerkUesrId),
		customersId: primaryKey(table.id),
		customersClerkUesrIdUnique: unique("customers_clerkUesrId_unique").on(table.clerkUesrId),
		customersStripeIdUnique: unique("customers_stripe_id_unique").on(table.stripeId),
	}
});

export const maps = mysqlTable("maps", {
	id: varchar("id", { length: 30 }).notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().onUpdateNow(),
	name: text("name").notNull(),
	views: int("views").default(0).notNull(),
	isPublic: tinyint("isPublic").default(1).notNull(),
	style: json("style").default('{}'),
	description: text("description").default(sql`''`),
	ownerId: varchar("ownerId", { length: 50 }).notNull(),
},
(table) => {
	return {
		mapIdIdx: index("map_id_index").on(table.id),
		ownerIdIdx: index("ownerId_index").on(table.ownerId),
		viewsIdx: index("views_index").on(table.views),
		mapsId: primaryKey(table.id),
	}
});

export const projects = mysqlTable("projects", {
	id: varchar("id", { length: 30 }).notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().onUpdateNow(),
	name: text("name").notNull(),
	mapId: varchar("mapId", { length: 30 }).notNull(),
	isVisible: tinyint("isVisible").default(1).notNull(),
	color: varchar("color", { length: 7 }).default(''),
	ownerId: varchar("ownerId", { length: 50 }).notNull(),
},
(table) => {
	return {
		projectIdIdx: index("project_id_index").on(table.id),
		projectMapIdIdx: index("project_mapId_index").on(table.mapId),
		projectOwnerIdIdx: index("project_ownerId_index").on(table.ownerId),
		projectsId: primaryKey(table.id),
	}
});

export const spots = mysqlTable("spots", {
	id: varchar("id", { length: 30 }).notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).defaultNow().onUpdateNow(),
	name: text("name").notNull(),
	address: text("address").notNull(),
	lat: double("lat").notNull(),
	lng: double("lng").notNull(),
	color: varchar("color", { length: 7 }).default('#3b82f6').notNull(),
	description: text("description").default(sql`''`),
	mapId: varchar("mapId", { length: 30 }).notNull(),
	projectId: varchar("projectId", { length: 30 }).default(''),
	ownerId: varchar("ownerId", { length: 50 }).notNull(),
},
(table) => {
	return {
		spotIdIdx: index("spot_id_index").on(table.id),
		spotMapIdIdx: index("spot_mapId_index").on(table.mapId),
		spotOwnerIdIdx: index("spot_ownerId_index").on(table.ownerId),
		spotProjectIdIdx: index("spot_projectId_index").on(table.projectId),
		spotsId: primaryKey(table.id),
	}
});