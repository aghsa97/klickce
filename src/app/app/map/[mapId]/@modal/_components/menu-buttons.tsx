'use client'

import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { NavigateToGoogleMaps } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import * as Icon from '@/components/icons'

function MenuBtns({ address }: { address: string }) {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <div className='flex items-center justify-end gap-1'>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size={'icon'} variant="outline" className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black"
                            onClick={() => NavigateToGoogleMaps(address)}
                        >
                            <Icon.Milestone className='w-6 h-6 md:w-8 md:h-8' strokeWidth={3} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Navigate with Google Maps</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Button size={'icon'} variant="outline" className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black mr-2"
                onClick={() => router.push(pathname)}
            >
                <Icon.Close className='w-6 h-6 md:w-8 md:h-8' strokeWidth={3} />
            </Button>
        </div>
    )
}

export default MenuBtns