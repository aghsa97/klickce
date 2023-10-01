import { and, eq } from "drizzle-orm";

import { protectedProcedure, router } from "../trpc";
import {
  insertProjectSchema,
  projectIdSchema,
  projects,
  selectProjectSchema,
  updateProjectSchema,
} from "@/lib/db/schema/projects";
import { genId } from "@/lib/db";

export const projectsRouter = router({
  getProjectById: protectedProcedure
    .input(projectIdSchema)
    .query(async ({ ctx, input }) => {
      if (!input.id) return;
      return selectProjectSchema.parse(
        await ctx.db
          .select()
          .from(projects)
          .where(
            and(
              eq(projects.id, input.id),
              eq(projects.ownerId, ctx.auth.userId),
            ),
          )
          .execute(),
      );
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
      return await ctx.db
        .delete(projects)
        .where(
          and(eq(projects.id, input.id), eq(projects.ownerId, ctx.auth.userId)),
        );
    }),
});
