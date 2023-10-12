import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    KLICKCE_MAPBOX_API_TOKEN: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    STRIPE_WEBHOOK_SECRET_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_MAPBOX_API_TOKEN: z.string().min(1),
    NEXT_PUBLIC_MAPBOX_USERNAME: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    // Client only
    NEXT_PUBLIC_MAPBOX_API_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN,
    NEXT_PUBLIC_MAPBOX_USERNAME: process.env.NEXT_PUBLIC_MAPBOX_USERNAME,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,

    // Server only
    KLICKCE_MAPBOX_API_TOKEN: process.env.KLICKCE_MAPBOX_API_TOKEN,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    STRIPE_WEBHOOK_SECRET_KEY: process.env.STRIPE_WEBHOOK_SECRET_KEY,
  },
});
