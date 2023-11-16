"use client";

import { useTransition } from "react";

import type { z } from "zod";

import { selectCustomerSchema } from "@/server/db/schema/customers";
import { Plan } from "@/components/landing-page/pricing-plan";
import { PlanProps, Plans, plansConfig } from "@/app/config";
import { getStripe } from "@/lib/stripe/client";
import { api } from "@/lib/trpc/client";


export const SettingsPlan = ({
    customerData,
}: {
    customerData: z.infer<typeof selectCustomerSchema>;
}) => {
    const [isPending, startTransition] = useTransition();

    const getCheckoutSession = (plan: Plans) => {
        startTransition(async () => {
            const result = await api.stripeRouter.getCheckoutSession.mutate({ plan })
            if (!result) return;

            const stripe = await getStripe();
            stripe?.redirectToCheckout({ sessionId: result.id });
        });
    };

    const plans: Record<"BASIC" | "PRO", PlanProps> = {
        BASIC: {
            ...plansConfig.BASIC,
            disabled: customerData.subPlan === "BASIC",
            loading: isPending && customerData.subPlan !== "BASIC",
            badge: "",
            action: {
                text: customerData.subPlan === "BASIC" ? "Current Plan" : customerData.subPlan === "PRO" ? "Downgrade" : "Upgrade",
                onClick: () => getCheckoutSession("BASIC"),
            },
        },
        PRO: {
            ...plansConfig.PRO,
            disabled: customerData.subPlan === "PRO",
            loading: isPending && customerData.subPlan !== "PRO",
            action: {
                text: customerData.subPlan === "PRO" ? "Current Plan" : "Upgrade",
                onClick: () => getCheckoutSession("PRO")
            },
        },
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Plan
                {...plans.BASIC}
                className="md:border-border/50"
            />
            <Plan
                {...plans.PRO}
                className="md:border-border/50"
            />
        </div>
    );
};