import Link from 'next/link'
import React from 'react'

import * as Icons from '../icons'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { GridSmallBackground } from '../grid-small-background'

function Hero() {
    return (
        <GridSmallBackground className='w-full flex items-center justify-center gap-3 py-24 md:px-16 md:py-48'>
            <div className='flex flex-col gap-9 xl:w-2/3'>
                <div className='flex flex-col items-center justify-center gap-1.5'>
                    <Badge variant={'default'} className='bg-gradient-to-r from-violet-500 to-rose-500'>Pre-Alpha</Badge>
                    <h1 className="text-pretty text-center text-foreground font-semibold text-xl leading-6 md:text-3xl xl:text-5xl xl:leading-[3.4rem]">
                        Put your business on the map and help your customers find you
                    </h1>
                </div>
                <div className='flex flex-col gap-6'>
                    <p className="text-center text-muted-foreground font-medium md:text-lg">
                        The easy way to create engaging, shareable maps for businesses, travelers, and anyone who loves to explore
                    </p>
                    <div className='flex items-center justify-center gap-3'>
                        <Button className='group' asChild>
                            <Link href="/sing-up">
                                Create your first map <span className='ml-1 italic hidden md:block'> - it&apos;s free</span>
                                <Icons.ChevronRight className='w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:animate-in' />
                            </Link>
                        </Button>
                        <Button variant={'link'} asChild>
                            <Link href="#">
                                Learn more
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </GridSmallBackground>
    )
}

export default Hero