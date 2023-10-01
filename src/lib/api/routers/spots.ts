import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";

import { protectedProcedure, publicProcedure, router } from "../trpc";

import {
  insertSpotSchema,
  selectSpotSchema,
  spotIdSchema,
  spots,
  updateSpotSchema,
} from "@/lib/db/schema/spots";
import { customers } from "@/lib/db/schema/customers";
import { allPlans } from "@/lib/plan";
import { genId } from "@/lib/db";
import { string, z } from "zod";

export const spotsRouter = router({
  getSpotsCount: publicProcedure.query(async ({ ctx }) => {
    const [count] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(spots)
      .execute();

    return count;
  }),
  getSpotById: protectedProcedure
    .input(spotIdSchema)
    .query(async ({ ctx, input }) => {
      if (!input.id) return;
      return selectSpotSchema.parse(
        await ctx.db
          .select()
          .from(spots)
          .where(
            and(eq(spots.id, input.id), eq(spots.ownerId, ctx.auth.userId)),
          )
          .execute(),
      );
    }),
  createSpot: protectedProcedure
    .input(insertSpotSchema)
    .mutation(async ({ ctx, input }) => {
      const currentCustomer = await ctx.db
        .select()
        .from(customers)
        .where(eq(customers.clerkUesrId, ctx.auth.userId))
        .execute();
      if (!currentCustomer) return;

      const [spotsCount] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(spots)
        .where(eq(spots.ownerId, currentCustomer[0].clerkUesrId))
        .execute();

      const userPlan = currentCustomer[0].SubPlan;
      const limit = allPlans[userPlan].limits.spots;

      if (spotsCount.count >= limit) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have reached the limit of spots.",
        });
      }

      const id = `spot_${genId()}`;
      const newSpot = insertSpotSchema.parse({ ...input });

      return await ctx.db
        .insert(spots)
        .values({ ...newSpot, id, ownerId: currentCustomer[0].clerkUesrId });
    }),
  updateSpot: protectedProcedure
    .input(updateSpotSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedSpot = updateSpotSchema.parse(input);
      console.log(updatedSpot);
      if (!updatedSpot.id) return;
      return await ctx.db
        .update(spots)
        .set(updatedSpot)
        .where(
          and(eq(spots.id, updatedSpot.id), eq(spots.ownerId, ctx.auth.userId)),
        );
    }),
  deleteSpot: protectedProcedure
    .input(spotIdSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.id) return;
      return await ctx.db
        .delete(spots)
        .where(and(eq(spots.id, input.id), eq(spots.ownerId, ctx.auth.userId)));
    }),
  deleteSpotsFromArrayIds: protectedProcedure
    .input(z.string().array())
    .mutation(async ({ ctx, input }) => {
      if (!input) return;
      for (const id of input) {
        return await ctx.db
          .delete(spots)
          .where(and(eq(spots.id, id), eq(spots.ownerId, ctx.auth.userId)));
      }
    }),
});
