import type { HTTPBatchLinkOptions, HTTPHeaders, TRPCLink } from "@trpc/client";
import { httpBatchLink } from "@trpc/client";
import { AppRouter } from "../api/routers/_app";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  const vc = process.env.VERCEL_URL;
  console.log("process.env.VERCEL_URL", vc);
  if (vc) return `https://${vc}`;
  console.log("Dev mode");
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
