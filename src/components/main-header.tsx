import React from 'react'
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Button, buttonVariants } from './ui/button';
import { auth, UserButton } from '@clerk/nextjs';
import * as Icons from './icons';

const ThemeToggle = dynamic(() => import("./theme-toggle"), {
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

function MainHeader() {
    const { userId } = auth()
    if (!userId)
        return (
            <div className='flex items-center justify-center gap-2'>
                <ThemeToggle />
                <Link href={"/sign-in"} className={buttonVariants({ variant: 'outline' })}>
                    Sign In
                </Link>
                <Link href={"/sign-up"} className={buttonVariants({ variant: 'default' })}>
                    Get Started For Free
                </Link>
            </div>
        )
    return (
        <div className='flex items-center justify-center gap-2'>
            <ThemeToggle />
            <Link href={"/dashboard"} className={buttonVariants({ variant: 'outline' })}>
                Dashboard
                <Icons.ArrowRight className='w-4 h-4 ml-1' />
            </Link>
            <UserButton />
        </div>
    )
}

export default MainHeader