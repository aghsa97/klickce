import { headers } from "next/headers";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { clerkEvent } from "@/server/api/routers/clerk/type";
import { appRouter } from "@/server/api/routers/_app";
import { createTRPCContext } from "@/server/api";
import { env } from "@/env";

const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Error occured -- no svix headers" },
      { status: 400 },
    );
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const res = clerkEvent.safeParse(payload);

  if (!res.success) {
    return NextResponse.json({ error: "invalid clerk event" }, { status: 500 });
  }

  const eventType = res.data.type;
  const ctx = createTRPCContext({ req });
  const caller = appRouter.createCaller(ctx);

  switch (eventType) {
    case "user.created":
      await caller.clerkRouter.webhooks.userCreated({ data: res.data });
      break;
    case "user.updated":
    case "user.deleted":
      break;

    case "session.created":
      break;
    case "session.revoked":
    case "session.removed":
    case "session.ended":
      break;

    case "organization.created":
    case "organizationMembership.created":
      break;

    default:
      ((d: WebhookEvent) => console.error(`${d} not handled here`))(eventType);
      break;
  }
  return NextResponse.json({ success: true });
}
