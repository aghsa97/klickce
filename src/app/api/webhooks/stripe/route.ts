import type { NextRequest } from "next/server";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

import { stripe } from "@/lib/api/routers/_app";

import { env } from "@/env";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("Stripe-Signature");
  if (!signature) return new Response("No signature", { status: 400 });
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET_KEY,
    );

    /**
     * Forward to tRPC API to handle the webhook event
    //const ctx = createTRPCContext({ req });
    //const caller = appRouter.createCaller(ctx);
    */

    switch (event.type) {
      case "checkout.session.completed":
        // await caller.stripeRouter.webhooks.sessionCompleted({ event });
        break;

      case "customer.subscription.deleted":
        // await caller.stripeRouter.webhooks.customerSubscriptionDeleted({
        //   event,
        // });
        break;

      case "customer.subscription.updated":
        // await caller.stripeRouter.webhooks.customerSubscriptionUpdated({
        //   event,
        // });
        break;

      case "customer.subscription.trial_will_end":
        break;

      default:
        throw new Error(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    if (error instanceof TRPCError) {
      const errorCode = getHTTPStatusCodeFromError(error);
      return new Response(error.message, { status: errorCode });
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Webhook Error: ${message}`, {
      status: 400,
    });
  }

  return new Response(null, { status: 200 });
}
