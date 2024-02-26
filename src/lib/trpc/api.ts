"use server";

import { headers } from "next/headers";
import { appRouter } from "../api/routers/_app";
import { loggerLink } from "@trpc/client";
import { experimental_createTRPCNextAppDirServer as createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import Superjson from "superjson";
import { endingLink } from "./shared";

export const api = createTRPCNextAppDirServer<typeof appRouter>({
  config() {
    return {
      transformer: Superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        endingLink({
          headers: Object.fromEntries(headers().entries()),
        }),
      ],
    };
  },
});

export { type RouterInputs, type RouterOutputs } from "../api";
