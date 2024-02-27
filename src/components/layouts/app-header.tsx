import Link from 'next/link';
import React from 'react'
import { UserButton } from '@clerk/nextjs';

import Logo from '../ui/logo';
import { cn } from '@/lib/utils';


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
            </div>
            <div className="flex items-center gap-4">
                <UserButton afterSignOutUrl='/' />
            </div>
        </nav>
    )
}

export default AppHeader