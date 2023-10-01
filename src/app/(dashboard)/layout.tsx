import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Logo from "@/components/ui/logo";

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

export default function DashboardLayout(props: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen overflow-hidden rounded-[0.5rem] max-w-screen-md mx-auto">
            <nav className="container z-50 flex h-16 items-center justify-between border-b bg-background">
                <div className="mr-8 hidden items-center md:flex">
                    <Logo size="lg" />
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <UserButton afterSignOutUrl='/' />
                </div>
            </nav>
            <main className="min-h-[calc(100vh-4rem)] flex flex-1 space-y-4 p-8 pt-6">
                {props.children}
            </main>
        </div>
    );
}