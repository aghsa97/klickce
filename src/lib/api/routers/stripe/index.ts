import { eq } from "drizzle-orm";
import { z } from "zod";

import { customers } from "@/lib/db/schema/customers";
import { allPlans } from "@/lib/plan";

import { router, protectedProcedure } from "../../trpc";
import { webhookRouter } from "./webhook";
import { stripe } from "./shared";

const url =
  process.env.NODE_ENV === "production"
    ? "https://www.klickce.se"
    : "http://localhost:3000";

export const stripeRouter = router({
  webhooks: webhookRouter,

  getCustomerPortal: protectedProcedure.mutation(async ({ ctx }) => {
    const currentCustomer = await ctx.db.query.customers.findFirst({
      where: eq(customers.clerkUesrId, ctx.auth.userId),
    });

    if (!currentCustomer) return;
    let stripeId = currentCustomer.stripeId;
    if (!stripeId) {
      const customerData: {
        metadata: { customerId: string };
        email?: string;
      } = {
        metadata: {
          customerId: String(currentCustomer.id),
        },
        email: currentCustomer.email || "",
      };

      const stripeUser = await stripe.customers.create(customerData);

      stripeId = stripeUser.id;
      await ctx.db
        .update(customers)
        .set({ stripeId })
        .where(eq(customers.id, currentCustomer.id))
        .execute();
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeId,
      return_url: `${url}/${currentCustomer.clerkUesrId}/settings`,
    });

    return session.url;
  }),

  getCheckoutSession: protectedProcedure
    .input(z.object({ plan: z.enum(["BASIC", "PRO"]) }))
    .mutation(async ({ ctx, input }) => {
      // The following code is duplicated we should extract it
      const currentCustomer = await ctx.db.query.customers.findFirst({
        where: eq(customers.clerkUesrId, ctx.auth.userId),
      });

      if (!currentCustomer) return;

      let stripeId = currentCustomer.stripeId;

      if (!stripeId) {
        const customerData: {
          metadata: { customerId: string };
          email?: string;
        } = {
          metadata: {
            customerId: String(currentCustomer.id),
          },
          email: currentCustomer.email || "",
        };
        const stripeUser = await stripe.customers.create(customerData);

        stripeId = stripeUser.id;
        await ctx.db
          .update(customers)
          .set({ stripeId })
          .where(eq(customers.id, currentCustomer.id))
          .execute();
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer: stripeId,

        line_items: [
          {
            price: allPlans[input.plan].stripePriceId,
            quantity: 1,
          },
        ],
        metadata: {
          customerId: String(currentCustomer.id),
          plan: input.plan,
        },
        mode: "subscription",
        success_url: `${url}/${currentCustomer.clerkUesrId}/settings?success=true`,
        cancel_url: `${url}/${currentCustomer.clerkUesrId}/settings`,
      });

      return session;
    }),
});
