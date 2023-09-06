import { NextRequest } from "next/server";

import { createContext } from "@/lib/trpc/context";
import { appRouter } from "@/lib/server/routers/_app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () => createContext({ req }),
    onError({ error, path }) {
      console.error(`[trpc] error in ${path}`);
      console.error(error);
    },
  });

export { handler as GET, handler as POST };
