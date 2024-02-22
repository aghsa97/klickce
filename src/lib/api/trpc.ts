import { ZodError } from "zod";
import superjson from "superjson";

import { initTRPC, TRPCError } from "@trpc/server";
import { NextRequest } from "next/server";
import {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/dist/types/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "../db";

interface CreateContextOptions {
  auth: SignedInAuthObject | SignedOutAuthObject | null;
  req?: NextRequest;
}

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    ...opts,
    db,
  };
};

export const createTRPCContext = (opts: { req: NextRequest }) => {
  const auth = getAuth(opts.req);

  return createInnerTRPCContext({
    auth,
    req: opts.req,
  });
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  // if (!ctx.auth?.userId) {
  //   throw new TRPCError({
  //     code: "UNAUTHORIZED",
  //     message: "You have to be logged in to do this.",
  //   });
  // }
  return next({
    ctx: {
      auth: {
        ...ctx.auth,
        userId: ctx.auth.userId,
      },
    },
  });
});

export const formdataMiddleware = t.middleware(async (opts) => {
  const formData = await opts.ctx.req?.formData?.();
  if (!formData) throw new TRPCError({ code: "BAD_REQUEST" });

  return opts.next({
    rawInput: formData,
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
