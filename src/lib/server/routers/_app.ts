import { router } from "../trpc";
import { mapsRouter } from "./maps";
import { spotsRouter } from "./spots";
import { customersRouter } from "./customers";

export const appRouter = router({
  maps: mapsRouter,
  spots: spotsRouter,
  customers: customersRouter,
});

export type AppRouter = typeof appRouter;
