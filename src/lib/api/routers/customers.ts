import { publicProcedure, router } from "../trpc";

export const customersRouter = router({
  ping: publicProcedure.query(async () => {
    return await Promise.resolve("pong");
  }),
});
