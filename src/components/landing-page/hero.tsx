import Link from 'next/link'
import React from 'react'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import Logo from '../ui/logo'

function Hero() {
    return (
        <div className='w-full flex flex-col gap-4 items-center rounded-lg border px-2 py-6 md:p-6'>
            <div className='flex flex-col items-center justify-center gap-2 mt-6'>
                <Badge variant={'outline'}>Pre-alpha</Badge>
                <h1 className="flex items-center justify-center gap-2 text-foreground font-semibold text-2xl md:text-3xl">
                    Map Your Dreams with  <Logo size='2xl' />
                </h1>
            </div>
            <p className="text-center text-muted-foreground font-medium text-base md:text-lg mt-2">
                Discover, Customize, and Share Your Passion
                <br />
                with Our Unique Maps.
            </p>
            <div className='flex items-center justify-center gap-4'>
                <Button variant={'outline'} asChild>
                    <Link href="/Sing-in">
                        Sign in
                    </Link>
                </Button>
                <Button variant={'ghost'} asChild>
                    <Link href="/Sing-up">
                        Create your first map
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default Hero