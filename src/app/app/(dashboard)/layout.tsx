import dynamic from "next/dynamic";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Logo from "@/components/ui/logo";
import AppHeader from "@/components/layouts/app-header";

const ThemeToggle = dynamic(() => import("@/components/theme-toggle"), {
    ssr: false,
    loading: () => (
        <Button
            variant="ghost"
            size="sm"
            className="gap-1 px-2 text-lg font-semibold md:text-base"
        >
            <div className="h-6 w-6 animate-pulse rounded-full bg-muted-foreground/70" />
        </Button>
    ),
});

async function DashboardLayout(props: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen overflow-hidden rounded-[0.5rem] max-w-screen-md mx-auto"
        >
            <AppHeader />
            <main className="min-h-[calc(100vh-4rem)] flex flex-1 space-y-4 p-4 md:px-0 pt-6">
                {props.children}
            </main>
        </div>
    );
}

export default DashboardLayout;