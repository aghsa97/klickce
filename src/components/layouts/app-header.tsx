import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react'

import { UserButton } from '@clerk/nextjs';
import { Button } from '../ui/button';
import Logo from '../ui/logo';
import { cn } from '@/lib/utils';

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

type AppHeaderProps = {
    className?: string
}

function AppHeader({ className }: AppHeaderProps) {
    return (
        <nav className={cn("w-full flex z-50 h-16 items-center justify-between border-b backdrop-blur-[2px]",
            className
        )}>
            <div className="flex items-center justify-between">
                <Link href={'/app'} className="mr-8 items-center flex">
                    <Logo />
                </Link>
                <Link href={`/app`} className="ml-8 hidden items-center md:flex text-sm text-muted-foreground hover:text-secondary-foreground">
                    Dashboard
                </Link>
                <Link href={`/app/settings`} className="ml-8 hidden items-center md:flex text-sm text-muted-foreground hover:text-secondary-foreground">
                    Settings
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <UserButton afterSignOutUrl='/' />
            </div>
        </nav>
    )
}

export default AppHeader