import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";

import { protectedProcedure, publicProcedure, router } from "../trpc";

import {
  insertMapSchema,
  mapIdSchema,
  maps,
  updateMapSchema,
} from "@/lib/db/schema/maps";
import { customers } from "@/lib/db/schema/customers";
import { allPlans } from "@/lib/plan";
import { genId } from "@/lib/db";

export const mapsRouter = router({
  getMapsCount: publicProcedure.query(async ({ ctx }) => {
    const [count] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(maps)
      .execute();
    return count;
  }),
  getViewsCount: publicProcedure.query(async ({ ctx }) => {
    const [count] = await ctx.db
      .select({ count: sql<number>`SUM(views)` })
      .from(maps)
      .execute();

    return count;
  }),
  getCustomerMaps: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(maps)
      .where(eq(maps.ownerId, ctx.auth.userId))
      .execute();
  }),
  getMapDataById: protectedProcedure
    .input(mapIdSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.maps.findFirst({
        where: and(eq(maps.id, input.id), eq(maps.ownerId, ctx.auth.userId)),
        columns: {
          id: true,
          name: true,
          style: true,
          isPublic: true,
          description: true,
          hasLandingPage: true,
          isUserCurrentLocationVisible: true,
        },
        with: {
          projects: {
            columns: {
              id: true,
              color: true,
              name: true,
              isVisible: true,
            },
            with: {
              spots: {
                columns: {
                  id: true,
                  name: true,
                  address: true,
                  lat: true,
                  lng: true,
                  color: true,
                  description: true,
                  projectId: true,
                },
              },
            },
          },
          spots: {
            where: (spots, { eq }) => eq(spots.projectId, ""),
            columns: {
              id: true,
              name: true,
              address: true,
              lat: true,
              lng: true,
              color: true,
              description: true,
              projectId: true,
            },
            orderBy: (spots, { desc }) => [desc(spots.createdAt)],
          },
        },
      });
    }),
  createMap: protectedProcedure
    .input(insertMapSchema)
    .mutation(async ({ ctx, input }) => {
      const currentCustomer = await ctx.db
        .select()
        .from(customers)
        .where(eq(customers.clerkUesrId, ctx.auth.userId))
        .execute();
      if (!currentCustomer) return;

      const [mapsCount] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(maps)
        .where(eq(maps.ownerId, ctx.auth.userId))
        .execute();

      const userPlan = currentCustomer[0].SubPlan;
      const limit = allPlans[userPlan].limits.maps;

      if (mapsCount.count >= limit) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have reached the limit for your plan.",
        });
      }

      const id = `map_${genId()}`;
      const newMap = insertMapSchema.parse({ ...input });

      await ctx.db
        .insert(maps)
        .values({ ...newMap, id, ownerId: ctx.auth.userId });
      return id;
    }),

  updateMap: protectedProcedure
    .input(updateMapSchema)
    .mutation(async ({ ctx, input }) => {
      const newMap = updateMapSchema.parse(input);
      if (!newMap.id) return;
      await ctx.db
        .update(maps)
        .set(newMap)
        .where(and(eq(maps.id, input.id), eq(maps.ownerId, ctx.auth.userId)));
    }),
  deleteMap: protectedProcedure
    .input(mapIdSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: delete all projects and spots related to this map? (no delete cascade in db)
      await ctx.db
        .delete(maps)
        .where(and(eq(maps.id, input.id), eq(maps.ownerId, ctx.auth.userId)));
    }),
});
