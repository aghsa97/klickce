import { router } from "../trpc";
import { mapsRouter } from "./maps";
import { spotsRouter } from "./spots";
import { customersRouter } from "./customers";
import { projectsRouter } from "./projects";
import { imagesRouter } from "./images";
import { clerkRouter } from "./clerk/webhook";

export const appRouter = router({
  maps: mapsRouter,
  spots: spotsRouter,
  images: imagesRouter,
  projects: projectsRouter,
  customers: customersRouter,
  clerkRouter: clerkRouter,
  // stripeRouter: stripeRouter,
});

export type AppRouter = typeof appRouter;

export { stripe } from "./stripe/shared";
