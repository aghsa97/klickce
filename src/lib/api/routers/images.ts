import { eq, sql } from "drizzle-orm";

import {
  imageIdSchema,
  images,
  insertImageSchema,
  selectImageSchema,
} from "@/lib/db/schema/images";
import { spotIdSchema } from "@/lib/db/schema/spots";

import { v2 as cloudinary } from "cloudinary";

import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { genId } from "@/lib/db";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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
  createCloudinaryImage: protectedProcedure
    .input(z.object({ fileName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const results = await cloudinary.uploader.upload(input.fileName, {
          public_id: "test",
          upload_preset: "o1ylfqms",
        });
        console.log("results", results);
      } catch (error) {
        console.log("error", error);
      }
    }),
  createImage: protectedProcedure
    .input(z.object({ spotId: z.string(), url: z.string(), mapId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = "img_" + genId();
      const { userId } = ctx.auth;
      try {
        const results = await cloudinary.uploader.upload(input.url, {
          public_id: `${userId}/${input.mapId}/${input.spotId}/${id}`,
          upload_preset: "o1ylfqms",
          transformation: {
            quality: "auto:best",
            fetch_format: "auto",
            width: 800,
            height: 600,
            crop: "limit",
          },
        });
        await ctx.db.insert(images).values({
          id: id,
          spotId: input.spotId,
          publicId: results.public_id,
        });
        return { id, publicId: results.public_id };
      } catch (error) {
        console.log("Error uploading image", error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error uploading image",
        });
      }
    }),
  deleteImage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        publicId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await cloudinary.api.delete_resources([input.publicId]);

      if (res.deleted[input.publicId] !== "deleted") return;
      await ctx.db.delete(images).where(eq(images.id, input.id));
    }),
});
