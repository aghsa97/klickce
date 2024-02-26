import type { HTTPBatchLinkOptions, HTTPHeaders, TRPCLink } from "@trpc/client";
import { httpBatchLink } from "@trpc/client";
import { AppRouter } from "../api/routers/_app";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  let vc = process.env.VERCEL_URL;
  if (process.env.VERCEL_ENV === "production") {
    return `https://www.klickce.se`;
  }
  if (vc) return `https://${vc}`;
  return `http://localhost:3000`;
};

export const endingLink = (opts?: { headers?: HTTPHeaders }) =>
  ((runtime) => {
    const sharedOpts = {
      headers: opts?.headers,
    } as Partial<HTTPBatchLinkOptions>;

    const endLink = httpBatchLink({
      ...sharedOpts,
      url: `${getBaseUrl()}/api/trpc`,
    })(runtime);

    return (ctx) => {
      const path = ctx.op.path.split(".") as [string, ...string[]];
      const newCtx = {
        ...ctx,
        op: { ...ctx.op, path: path.join(".") },
      };
      return endLink(newCtx);
    };
  }) as TRPCLink<AppRouter>;
