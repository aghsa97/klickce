import { eq } from "drizzle-orm";
import { db } from "../db";
import { maps } from "../db/schema/maps";
import { auth } from "@clerk/nextjs";
import { spots } from "../db/schema/spots";
import { projects } from "../db/schema/projects";
import { images } from "../db/schema/images";

export async function getCustomerMaps() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not found");
  }
  const res = await db
    .select()
    .from(maps)
    .where(eq(maps.ownerId, userId))
    .execute();
  return res;
}

export async function getMapById(id: string) {
  const res = await db.query.maps.findFirst({
    where: eq(maps.id, id),
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
  return res;
}

export async function getSpotById(id: string) {
  const res = await db.query.spots.findFirst({
    where: eq(spots.id, id),
  });
  return res;
}

export async function getProjectsByMapId(id: string) {
  const res = await db.query.projects.findMany({
    where: eq(projects.mapId, id),
  });
  return res;
}

export async function getProjectById(id: string) {
  const res = await db.query.projects.findFirst({
    where: eq(projects.id, id),
  });
  return res;
}

export async function getImagesBySpotId(id: string) {
  const res = await db.query.images.findMany({
    where: eq(images.spotId, id),
  });
  return res;
}
