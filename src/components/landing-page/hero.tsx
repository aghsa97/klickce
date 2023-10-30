import Link from 'next/link'
import React from 'react'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

function Hero() {
    return (
        <div className='w-full flex flex-col gap-4 items-center rounded-lg border px-2 py-6 sm:p-6'>
            <div className='flex flex-col items-center justify-center gap-2 mt-6'>
                <Badge variant={'outline'}>Pre-Alpha</Badge>
                <h1 className="text-center text-foreground font-semibold text-xl sm:text-3xl">
                    Build awesome custom maps
                </h1>
            </div>
            <p className="text-center text-muted-foreground font-medium text-sm sm:text-lg mt-2">
                Discover, customize, and share your vision
                <br />
                with our unique canvas.
            </p>
            <div className='flex items-center justify-center gap-4'>
                <Button variant={'outline'} asChild>
                    <Link href="/sign-in">
                        Sign in
                    </Link>
                </Button>
                <Button variant={'ghost'} asChild>
                    <Link href="/sign-up">
                        Create your first map
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default Hero