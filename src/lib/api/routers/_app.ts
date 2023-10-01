import { router } from "../trpc";
import { mapsRouter } from "./maps";
import { spotsRouter } from "./spots";
import { customersRouter } from "./customers";
import { projectsRouter } from "./projects";
import { imagesRouter } from "./images";

export const appRouter = router({
  maps: mapsRouter,
  spots: spotsRouter,
  images: imagesRouter,
  projects: projectsRouter,
  customers: customersRouter,
});

export type AppRouter = typeof appRouter;
