import dynamic from "next/dynamic";

import Link from "next/link";

import Map from "@/components/map";
import Logo from "@/components/ui/logo";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

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

export default async function OnboardingLayout(props: { children: React.ReactNode, params: { mapId: string } }) {
    return (
        <div className="w-full min-h-screen overflow-hidden">
            <nav className="z-50 flex h-16 items-center justify-between border-b bg-background px-8">
                <div className="flex items-center justify-between">
                    <Link href={'/dashboard'} className="mr-8 hidden items-center md:flex">
                        <Logo size="lg" />
                    </Link>
                    <Link href={'/dashboard'} className="ml-8 hidden items-center md:flex text-sm text-muted-foreground hover:text-secondary-foreground">
                        Dashboard
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <UserButton afterSignOutUrl='/' />
                </div>
            </nav>
            <main className="min-h-[calc(100vh-4rem)] flex flex-1">
                <div className='w-full flex'>
                    <aside className='flex h-full relative'>
                        <div className='w-full'>
                            {props.children}
                        </div>
                    </aside>
                    <div className='w-full m-4 border border-border bg-muted rounded-lg flex flex-col'>
                        <div className='px-4 py-3 flex items-center justify-start gap-2'>
                            <div className='h-3 w-3 rounded-full bg-red-400'></div>
                            <div className='h-3 w-3 rounded-full bg-yellow-400'></div>
                            <div className='h-3 w-3 rounded-full bg-green-400'></div>
                        </div>
                        <Map />
                    </div>
                </div>
            </main>
        </div>
    );
}