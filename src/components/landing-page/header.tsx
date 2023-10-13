import Link from 'next/link';
import dynamic from 'next/dynamic';

import { cn } from '@/lib/utils';
import { auth, UserButton } from '@clerk/nextjs';
import { Button, buttonVariants } from '../ui/button';

import * as Icons from '../icons';

const ThemeToggle = dynamic(() => import("../theme-toggle"), {
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

function Header() {
    const { userId } = auth()
    if (!userId)
        return (
            <div className='flex items-center justify-center gap-2'>
                <ThemeToggle />
                <Link href={"/sign-in"} className={buttonVariants({ variant: 'outline' })}>
                    Sign In
                </Link>
                <Link href={"/sign-up"} className={cn(buttonVariants({ variant: 'default' }), 'group')}>
                    Get Started <span className='ml-1 italic hidden md:block'> - it&apos;s free</span>
                    <Icons.ChevronRight className='w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:animate-in' />
                </Link>
            </div>
        )
    return (
        <div className='flex items-center justify-center gap-2'>
            <ThemeToggle />
            <Link href={"/app"} className={buttonVariants({ variant: 'outline' })}>
                Dashboard
                <Icons.ArrowRight className='w-4 h-4 ml-1' />
            </Link>
            <UserButton afterSignOutUrl='/' />
        </div>
    )
}

export default Header