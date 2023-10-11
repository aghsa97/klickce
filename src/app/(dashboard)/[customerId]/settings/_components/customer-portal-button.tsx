"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";


import { LoadingAnimation } from "@/components/loading-animation";
import { api } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";


export function CustomerPortalButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const getCustomerPortal = () => {
        startTransition(async () => {
            const url = await api.stripeRouter.getCustomerPortal.mutate()
            if (!url) return;
            router.push(url);
            return;
        });
    };

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={getCustomerPortal}
            disabled={isPending}
        >
            {isPending ? <LoadingAnimation variant="inverse" /> : "Manage your subscription"}
        </Button>
    );
}