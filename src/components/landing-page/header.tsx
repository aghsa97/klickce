import Link from 'next/link';

import { cn } from '@/lib/utils';
import { auth, UserButton } from '@clerk/nextjs';
import { buttonVariants } from '../ui/button';

import * as Icons from '../icons';

function Header() {
    const { userId } = auth()
    if (!userId)
        return (
            <div className='flex items-center justify-center gap-2'>
                <Link href={"/sign-in"} className={cn(buttonVariants({ size: "lg" }), "rounded-full uppercase hover:bg-transparent hover:text-zinc-950 ring-1 ring-zinc-950")}>
                    Sign In
                </Link>
            </div>
        )
    return (
        <div className='flex items-center justify-center gap-2'>
            <Link href={"/app"} className={buttonVariants({ variant: 'outline' })}>
                Dashboard
                <Icons.ArrowRight className='w-4 h-4 ml-1' />
            </Link>
            <UserButton afterSignOutUrl='/' />
        </div>
    )
}

export default Header