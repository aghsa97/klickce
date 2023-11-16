import { TRPCError } from "@trpc/server";
import { and, eq, inArray, sql } from "drizzle-orm";

import { protectedProcedure, publicProcedure, router } from "../trpc";

import {
  insertMapSchema,
  mapIdSchema,
  maps as mapsTable,
  selectMapSchema,
  updateMapSchema,
} from "@/server/db/schema/maps";
import { customers } from "@/server/db/schema/customers";
import { allPlans } from "@/config/plan";
import { genId } from "@/server/db";
import {
  projects as projectsTable,
  selectProjectSchema,
} from "@/server/db/schema/projects";
import {
  selectSpotSchema,
  spots as spotsTable,
} from "@/server/db/schema/spots";
import { images } from "@/server/db/schema/images";
import { deleteFolder, deleteImage } from "@/lib/cloudinary";

export const mapsRouter = router({
  getMapsCount: publicProcedure.query(async ({ ctx }) => {
    const [count] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(mapsTable)
      .execute();
    return count;
  }),
  getViewsCount: publicProcedure.query(async ({ ctx }) => {
    const [count] = await ctx.db
      .select({ count: sql<number>`SUM(views)` })
      .from(mapsTable)
      .execute();

    return count;
  }),
  getCustomerMaps: protectedProcedure.query(async ({ ctx }) => {
    const customerMaps = await ctx.db
      .select({
        id: mapsTable.id,
        name: mapsTable.name,
      })
      .from(mapsTable)
      .where(eq(mapsTable.ownerId, ctx.auth.userId))
      .execute();

    return customerMaps;
  }),
  getPublicMapById: publicProcedure
    .input(mapIdSchema)
    .query(async ({ ctx, input }) => {
      const mapdata = await ctx.db
        .select()
        .from(mapsTable)
        .where(eq(mapsTable.id, input.id))
        .execute();

      if (mapdata.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Map not found.",
        });
      }

      const customer = await ctx.db
        .select()
        .from(customers)
        .where(eq(customers.clerkUesrId, mapdata[0].ownerId))
        .execute();

      const now = new Date();
      if (
        !customer[0].subPlan ||
        !customer[0].paidUntil ||
        !customer[0].endsAt ||
        customer[0].paidUntil < now ||
        customer[0].endsAt < now
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "This map is not available now. Please contact the owner of this map.",
        });
      }
      const map = selectMapSchema.parse(mapdata[0]);

      if (!map.isPublic) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Map is set to private from the owner.",
        });
      }

      const [projectsdata, spotsdata] = await Promise.all([
        ctx.db
          .select()
          .from(projectsTable)
          .where(
            and(
              eq(projectsTable.mapId, map.id),
              eq(projectsTable.isVisible, true),
            ),
          )
          .execute(),
        ctx.db
          .select()
          .from(spotsTable)
          .where(eq(spotsTable.mapId, map.id))
          .execute(),
      ]);

      const spotsparsed = spotsdata.map((spot) => ({
        ...selectSpotSchema.parse(spot),
      }));

      const projects = projectsdata.map((project) => ({
        ...selectProjectSchema.parse(project),
        spots: spotsparsed.filter((spot) => spot.projectId === project.id),
      }));

      const spots = spotsparsed.filter((spot) => spot.projectId === "");

      return { map, projects, spots };
    }),
  getMapDataById: protectedProcedure
    .input(mapIdSchema)
    .query(async ({ ctx, input }) => {
      const maps = await ctx.db
        .select()
        .from(mapsTable)
        .where(
          and(
            eq(mapsTable.id, input.id),
            eq(mapsTable.ownerId, ctx.auth.userId),
          ),
        )
        .execute();

      if (maps.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Map not found.",
        });
      }
      const map = selectMapSchema.parse(maps[0]);

      const projectsdata = await ctx.db
        .select()
        .from(projectsTable)
        .where(eq(projectsTable.mapId, map.id))
        .execute();

      const spotsdata = await ctx.db
        .select()
        .from(spotsTable)
        .where(eq(spotsTable.mapId, map.id))
        .execute();

      const spotsparsed = spotsdata.map((spot) => ({
        ...selectSpotSchema.parse(spot),
      }));

      const projects = projectsdata.map((project) => ({
        ...selectProjectSchema.parse(project),
        spots: spotsparsed.filter((spot) => spot.projectId === project.id),
      }));
      // parse with selectSpotSchema
      const spots = spotsparsed.filter((spot) => spot.projectId === "");

      return { map, projects, spots };
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

      // Check if user has a plan and if it's not expired
      const userPlan = currentCustomer[0].subPlan;
      const userPaidUntil = currentCustomer[0].paidUntil;
      const userEndsAt = currentCustomer[0].endsAt;
      const now = new Date();
      if (!userPlan || !userPaidUntil || !userEndsAt) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You don't have a plan, please subscribe to start using Klickce.",
        });
      }
      if (userPaidUntil < now || userEndsAt < now) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Your plan has expired, please subscribe to continue using Klickce.",
        });
      }

      // Check if user has reached the limit of maps for his plan
      const [mapsCount] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(mapsTable)
        .where(eq(mapsTable.ownerId, ctx.auth.userId))
        .execute();
      const limit = allPlans[userPlan].limits.maps;

      if (
        mapsCount.count >= limit &&
        currentCustomer[0].id !== 1 &&
        currentCustomer[0].id !== 2 // HOT FIX FOR DEMO ACCOUNTS CHANGE IT LATER
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have reached the limit for your plan.",
        });
      }

      const id = `map_${genId()}`;
      const newMap = insertMapSchema.parse({ ...input });
      await ctx.db
        .insert(mapsTable)
        .values({ ...newMap, id, ownerId: ctx.auth.userId });
      return id;
    }),

  updateMap: protectedProcedure
    .input(updateMapSchema)
    .mutation(async ({ ctx, input }) => {
      const newMap = updateMapSchema.parse(input);
      if (!newMap.id) return;
      await ctx.db
        .update(mapsTable)
        .set(newMap)
        .where(
          and(
            eq(mapsTable.id, input.id),
            eq(mapsTable.ownerId, ctx.auth.userId),
          ),
        );
    }),
  deleteMap: protectedProcedure
    .input(mapIdSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: delete all projects and spots related to this map? (no delete cascade in db)
      const projectIds = await ctx.db
        .select({ id: projectsTable.id })
        .from(projectsTable)
        .where(
          and(
            eq(projectsTable.mapId, input.id),
            eq(projectsTable.ownerId, ctx.auth.userId),
          ),
        )
        .execute();

      const spotIds = await ctx.db
        .select({ id: spotsTable.id })
        .from(spotsTable)
        .where(
          and(
            eq(spotsTable.mapId, input.id),
            eq(spotsTable.ownerId, ctx.auth.userId),
          ),
        )
        .execute();

      if (projectIds.length > 0) {
        await ctx.db
          .delete(projectsTable)
          .where(
            and(
              eq(projectsTable.mapId, input.id),
              eq(projectsTable.ownerId, ctx.auth.userId),
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
          .delete(spotsTable)
          .where(
            and(
              eq(spotsTable.mapId, input.id),
              eq(spotsTable.ownerId, ctx.auth.userId),
            ),
          );
      }

      await ctx.db
        .delete(mapsTable)
        .where(
          and(
            eq(mapsTable.id, input.id),
            eq(mapsTable.ownerId, ctx.auth.userId),
          ),
        );
    }),
});
