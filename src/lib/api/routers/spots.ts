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
import { mapIdSchema } from "@/lib/db/schema/maps";
import { customers } from "@/lib/db/schema/customers";
import { allPlans } from "@/lib/plan";
import { genId } from "@/lib/db";
import { deleteFolder, deleteImage } from "@/lib/cloudinary";
import { images } from "@/lib/db/schema/images";
import { z } from "zod";

export const spotsRouter = router({
  getSpotsCount: publicProcedure.query(async ({ ctx }) => {
    const [count] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(spots)
      .execute();

    return count;
  }),
  getSpotById: publicProcedure
    .input(z.object({ spotIdSchema, mapIdSchema }))
    .query(async ({ ctx, input }) => {
      if (!input.spotIdSchema.id || !input.mapIdSchema.id) return;
      return selectSpotSchema.parse(
        await ctx.db.query.spots.findFirst({
          where: and(
            eq(spots.id, input.spotIdSchema.id),
            eq(spots.mapId, input.mapIdSchema.id),
          ),
        }),
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

      const userPlan = currentCustomer[0].subPlan;
      if (!userPlan) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You don't have a plan, please subscribe to start using Klickce.",
        });
      }
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
      const imgs = await ctx.db
        .select({
          id: images.id,
          publicId: images.publicId,
        })
        .from(images)
        .where(
          and(eq(images.spotId, input.id), eq(images.ownerId, ctx.auth.userId)),
        )
        .execute();

      if (imgs.length > 0) {
        try {
          for (const img of imgs) {
            await deleteImage(img.publicId);
            await ctx.db.delete(images).where(eq(images.id, img.id));
          }
          const spotFolderPath = imgs[0].publicId
            .split("/")
            .slice(0, -1)
            .join("/");
          await deleteFolder(spotFolderPath);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete images.",
          });
        }
      }
      return await ctx.db
        .delete(spots)
        .where(and(eq(spots.id, input.id), eq(spots.ownerId, ctx.auth.userId)));
    }),
});
