import { and, eq } from "drizzle-orm";

import { protectedProcedure, publicProcedure, router } from "../trpc";
import {
  insertProjectSchema,
  projectIdSchema,
  projects,
  selectProjectSchema,
  updateProjectSchema,
} from "@/server/db/schema/projects";
import { genId } from "@/server/db";
import { spots } from "@/server/db/schema/spots";
import { mapIdSchema } from "@/server/db/schema/maps";

export const projectsRouter = router({
  getProjectById: publicProcedure
    .input(projectIdSchema)
    .query(async ({ ctx, input }) => {
      if (!input.id) return;
      return selectProjectSchema.parse(
        await ctx.db.query.projects.findFirst({
          where: eq(projects.id, input.id),
        }),
      );
    }),
  getProjectsByMapId: protectedProcedure
    .input(mapIdSchema)
    .query(async ({ ctx, input }) => {
      if (!input.id) return;
      return await ctx.db.query.projects.findMany({
        where: and(
          eq(projects.mapId, input.id),
          eq(projects.ownerId, ctx.auth.userId),
        ),
      });
    }),
  createProject: protectedProcedure
    .input(insertProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const newProject = insertProjectSchema.parse(input);
      const id = "project_" + genId();
      return await ctx.db
        .insert(projects)
        .values({ id, ...newProject, ownerId: ctx.auth.userId });
    }),
  updateProject: protectedProcedure
    .input(updateProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedProject = updateProjectSchema.parse(input);
      if (!updatedProject.id) return;
      return await ctx.db
        .update(projects)
        .set(updatedProject)
        .where(
          and(
            eq(projects.id, updatedProject.id),
            eq(projects.ownerId, ctx.auth.userId),
          ),
        );
    }),
  deleteProject: protectedProcedure
    .input(projectIdSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.id) return;
      // TODO: delete all spots in this project? (no delete cascade in db)
      const spotsIds = await ctx.db
        .select({ id: spots.id })
        .from(spots)
        .where(
          and(
            eq(spots.projectId, input.id),
            eq(spots.ownerId, ctx.auth.userId),
          ),
        )
        .execute();

      if (spotsIds.length > 0) {
        await ctx.db
          .delete(spots)
          .where(
            and(
              eq(spots.projectId, input.id),
              eq(spots.ownerId, ctx.auth.userId),
            ),
          )
          .execute();
      }

      return await ctx.db
        .delete(projects)
        .where(
          and(eq(projects.id, input.id), eq(projects.ownerId, ctx.auth.userId)),
        );
    }),
});
