import dynamic from "next/dynamic";
import Link from "next/link";

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

async function DashboardLayout(props: { children: React.ReactNode, params: { customerId: string } }) {
    return (
        <div className="min-h-screen overflow-hidden rounded-[0.5rem] max-w-screen-md mx-auto"
        >
            <nav className="w-full px-4 flex max-w-screen-md z-50 h-16 items-center justify-between border-b backdrop-blur-[2px] p-4 md:p-0">
                <div className="flex items-center justify-between">
                    <Link href={'/'} className="mr-8 items-center flex">
                        <Logo size="lg" />
                    </Link>
                    <Link href={'/dashboard'} className="ml-8 hidden items-center md:flex text-sm text-muted-foreground hover:text-secondary-foreground">
                        Dashboard
                    </Link>
                    <Link href={`${props.params.customerId}/settings`} className="ml-8 hidden items-center md:flex text-sm text-muted-foreground hover:text-secondary-foreground">
                        Settings
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <UserButton afterSignOutUrl='/' />
                </div>
            </nav>
            <main className="min-h-[calc(100vh-4rem)] flex flex-1 space-y-4 p-4 md:px-0 pt-6">
                {props.children}
            </main>
        </div>
    );
}

export default DashboardLayout;