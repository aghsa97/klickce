import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type Stripe from "stripe";

import { router, publicProcedure } from "../../trpc";
import { stripe } from "./shared";
import { customers } from "@/lib/db/schema/customers";
import { eq } from "drizzle-orm";
import { Plans } from "@/app/config";

const webhookProcedure = publicProcedure.input(
  z.object({
    // From type Stripe.Event
    event: z.object({
      id: z.string(),
      account: z.string().nullish(),
      created: z.number(),
      data: z.object({
        object: z.record(z.any()),
      }),
      type: z.string(),
    }),
  }),
);

export const webhookRouter = router({
  sessionCompleted: webhookProcedure.mutation(async ({ ctx, input }) => {
    const session = input.event.data.object as Stripe.Checkout.Session;
    if (typeof session.subscription !== "string") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing or invalid subscription id",
      });
    }
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription,
    );

    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;

    const currentCustomer = await ctx.db.query.customers.findFirst({
      where: eq(customers.stripeId, customerId),
    });

    if (!currentCustomer) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Customer not found",
      });
    }

    if (currentCustomer.subscriptionId) {
      await stripe.subscriptions.update(currentCustomer.subscriptionId, {
        cancel_at_period_end: true,
      });
    }

    await ctx.db
      .update(customers)
      .set({
        subscriptionId: subscription.id,
        subPlan: session.metadata?.plan as Plans,
        endsAt: new Date(subscription.current_period_end * 1000),
        paidUntil: new Date(subscription.current_period_end * 1000),
      })
      .where(eq(customers.id, currentCustomer.id))
      .execute();
  }),
  customerSubscriptionDeleted: webhookProcedure.mutation(
    async ({ input, ctx }) => {
      const subscription = input.event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      await ctx.db
        .update(customers)
        .set({
          subscriptionId: null,
          subPlan: null,
          paidUntil: null,
        })
        .where(eq(customers.stripeId, customerId))
        .execute();
    },
  ),
});
