import { NextRequest } from "next/server";

import { appRouter } from "@/lib/api/routers/_app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/lib/api/trpc";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req: req,
    createContext: () => createTRPCContext({ req }),
    onError({ error, path }) {
      console.error(`[trpc] error in ${path}`);
      console.error(error);
    },
  });

export { handler as GET, handler as POST };
