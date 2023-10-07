import { TRPCError } from "@trpc/server";
import { and, eq, inArray, sql } from "drizzle-orm";

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
import { projects } from "@/lib/db/schema/projects";
import { spots } from "@/lib/db/schema/spots";
import { images } from "@/lib/db/schema/images";
import { deleteFolder, deleteImage } from "@/lib/cloudinary";

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
  getMapById: publicProcedure
    .input(mapIdSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.maps.findFirst({
        where: and(eq(maps.id, input.id), eq(maps.isPublic, true)),
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
            where: (projects, { eq }) => eq(projects.isVisible, true),
            columns: {
              id: true,
              color: true,
              name: true,
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
      if (!userPlan) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You don't have a plan, please subscribe to start using Klickce.",
        });
      }

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
      const projectIds = await ctx.db
        .select({ id: projects.id })
        .from(projects)
        .where(
          and(
            eq(projects.mapId, input.id),
            eq(projects.ownerId, ctx.auth.userId),
          ),
        )
        .execute();

      const spotIds = await ctx.db
        .select({ id: spots.id })
        .from(spots)
        .where(
          and(eq(spots.mapId, input.id), eq(spots.ownerId, ctx.auth.userId)),
        )
        .execute();

      if (projectIds.length > 0) {
        await ctx.db
          .delete(projects)
          .where(
            and(
              eq(projects.mapId, input.id),
              eq(projects.ownerId, ctx.auth.userId),
            ),
          );
      }

      if (spotIds.length > 0) {
        const imgs = await ctx.db
          .select({ id: images.id, publicId: images.publicId })
          .from(images)
          .where(
            and(
              eq(images.ownerId, ctx.auth.userId),
              inArray(
                images.spotId,
                spotIds.map((s) => s.id),
              ),
            ),
          )
          .execute();

        if (imgs.length > 0) {
          const mapFolderPath = imgs[0].publicId
            .split("/")
            .slice(0, 3)
            .join("/");
          for (const img of imgs) {
            await deleteImage(img.publicId);
          }
          await deleteFolder(mapFolderPath);
          await ctx.db.delete(images).where(
            and(
              eq(images.ownerId, ctx.auth.userId),
              inArray(
                images.spotId,
                spotIds.map((s) => s.id),
              ),
            ),
          );
        }

        await ctx.db
          .delete(spots)
          .where(
            and(eq(spots.mapId, input.id), eq(spots.ownerId, ctx.auth.userId)),
          );
      }

      await ctx.db
        .delete(maps)
        .where(and(eq(maps.id, input.id), eq(maps.ownerId, ctx.auth.userId)));
    }),
});
