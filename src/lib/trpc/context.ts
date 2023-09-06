import type { NextRequest } from "next/server";

import { getAuth } from "@clerk/nextjs/server";

export async function createContext(opts: { req: NextRequest }) {
  const auth = getAuth(opts.req);
  return {
    auth,
    headers: opts && Object.fromEntries(opts.req.headers),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
