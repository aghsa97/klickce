import { customers } from "@/lib/db/schema/customers";
import { eq } from "drizzle-orm";
import * as z from "zod";
import { env } from "../../env";

import { router, publicProcedure } from "../../trpc";
import { stripe } from "../_app";
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

      const stripeCustomer = await stripe.customers.create({
        email: input.data.data.email_addresses[0].email_address,
        metadata: {
          clerkUesrId: input.data.data.id,
        },
      });

      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [{ price: env.STRIPE_BASIC_MONTHLY_PRICE_ID }],
        trial_period_days: 30,
        trial_settings: {
          end_behavior: {
            missing_payment_method: "pause",
          },
        },
        metadata: {
          plan: "BASIC",
        },
      });

      await ctx.db
        .update(customers)
        .set({
          stripeId: stripeCustomer.id,
          subscriptionId: subscription.id,
          subPlan: "BASIC",
          endsAt: new Date(subscription.current_period_end * 1000),
          paidUntil: new Date(subscription.current_period_end * 1000),
          onTrial: true,
        })
        .where(eq(customers.clerkUesrId, input.data.data.id))
        .execute();
    }

    // TODO: Send email and create the analytics
  }),
});

export const clerkRouter = router({
  webhooks: webhookRouter,
});
