import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { imageIdSchema, images } from "@/lib/db/schema/images";
import { spotIdSchema } from "@/lib/db/schema/spots";

import { protectedProcedure, router } from "../trpc";
import { genId } from "@/lib/db";
import { deleteImage, uploadImage } from "@/lib/cloudinary";

export const imagesRouter = router({
  getImagesBySpotId: protectedProcedure
    .input(spotIdSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(images)
        .where(eq(images.spotId, input.id))
        .execute();
    }),
  getImageById: protectedProcedure
    .input(imageIdSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(images)
        .where(eq(images.id, input.id))
        .execute();
    }),
  createImage: protectedProcedure
    .input(z.object({ spotId: z.string(), url: z.string(), mapId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      const id = "img_" + genId();
      const publicId = `${userId}/${input.mapId}/${input.spotId}/${id}`;

      const imgs = await ctx.db.query.images.findMany({
        where: and(eq(images.spotId, input.spotId), eq(images.ownerId, userId)),
        columns: {
          id: true,
          publicId: true,
        },
      });

      if (imgs.length >= 4) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Maximum number of images reached",
        });
      }

      try {
        const res = await uploadImage(input.url, publicId);
        if (!res) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Error uploading image",
          });
        }
        await ctx.db.insert(images).values({
          id,
          spotId: input.spotId,
          publicId: res.publicId,
          ownerId: userId,
        });
        return { id, publicId: res.publicId };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error uploading image",
        });
      }
    }),
  deleteImage: protectedProcedure
    .input(imageIdSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;

      const image = await ctx.db.query.images.findFirst({
        where: and(eq(images.id, input.id), eq(images.ownerId, userId)),
        columns: {
          id: true,
          publicId: true,
        },
      });

      if (!image) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Image not found",
        });
      }

      try {
        await deleteImage(image.publicId);
        await ctx.db.delete(images).where(eq(images.id, image.id));
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error deleting image",
        });
      }
    }),
});
