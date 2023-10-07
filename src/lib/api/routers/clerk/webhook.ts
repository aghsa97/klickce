import { customers } from "@/lib/db/schema/customers";
import { eq } from "drizzle-orm";
import * as z from "zod";

import { router, publicProcedure } from "../../trpc";
import { clerkEvent } from "./type";

export const webhookProcedure = publicProcedure.input(
  z.object({
    data: clerkEvent,
  }),
);

export const webhookRouter = router({
  userCreated: webhookProcedure.mutation(async ({ ctx, input }) => {
    if (input.data.type === "user.created") {
      const isCustomer = await ctx.db.query.customers.findFirst({
        where: eq(customers.clerkUesrId, input.data.data.id),
      });
      if (isCustomer) return;

      await ctx.db
        .insert(customers)
        .values({
          email: input.data.data.email_addresses[0].email_address,
          clerkUesrId: input.data.data.id,
          name:
            input.data.data.first_name || "" + input.data.data.last_name || "",
        })
        .execute();
    }

    // TODO: Send email and create the analytics
  }),
});

export const clerkRouter = router({
  webhooks: webhookRouter,
});
