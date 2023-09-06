import { publicProcedure, router } from "../trpc";

import { getSpotsCount } from "@/lib/api/spots/queries";

export const spotsRouter = router({
  getSpotsCount: publicProcedure.query(async () => {
    return getSpotsCount();
  }),
});
