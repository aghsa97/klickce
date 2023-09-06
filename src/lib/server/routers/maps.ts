import { publicProcedure, router } from "../trpc";

import { getMapsCount, getViewsCount } from "@/lib/api/maps/queries";

export const mapsRouter = router({
  getMapsCount: publicProcedure.query(async () => {
    return getMapsCount();
  }),
  getViewsCount: publicProcedure.query(async () => {
    return getViewsCount();
  }),
});
