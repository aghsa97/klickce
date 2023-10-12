import { env } from "../api/env";

type Plan = {
  limits: {
    maps: number;
    views: number;
    spots: number;
  };
  stripePriceId: string;
};

export const allPlans: Record<"BASIC" | "PRO", Plan> = {
  BASIC: {
    limits: {
      maps: 1,
      views: 1000, // 1k
      spots: 50,
    },
    stripePriceId: env.STRIPE_BASIC_MONTHLY_PRICE_ID,
  },
  PRO: {
    limits: {
      maps: 5,
      views: 3000, // 3k
      spots: 200,
    },
    stripePriceId: env.STRIPE_PRO_MONTHLY_PRICE_ID,
  },
};
