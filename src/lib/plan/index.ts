type Plan = {
  limits: {
    maps: number;
    views: number;
    spots: number;
  };
};

export const allPlans: Record<"BASIC" | "PRO" | "ENTERPRISE", Plan> = {
  BASIC: {
    limits: {
      maps: 1,
      views: 1000, // 1k
      spots: 50,
    },
  },
  PRO: {
    limits: {
      maps: 5,
      views: 10000, // 10k
      spots: 500,
    },
  },
  ENTERPRISE: {
    limits: {
      maps: 100,
      views: 100000, // 100k
      spots: 5000, // 5k
    },
  },
};
