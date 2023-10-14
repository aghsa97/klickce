'use client'

import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { CldImage } from 'next-cloudinary'

import { Button } from '../ui/button'

import * as Icon from '@/components/icons'
import { RouterOutputs } from '@/lib/api'
import { cn, NavigateToGoogleMaps } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import useWindowSize from '@/hooks/use-window-size'

type data = NonNullable<RouterOutputs["maps"]["getMapById"]>

type SideMenuBarProps = {
    spotData: data["spots"][0] | data["projects"][0]["spots"][0] | null | undefined,
    publicIds: string[],
}

function SideMenuBar({ spotData, publicIds }: SideMenuBarProps) {
    const router = useRouter()
    const pathname = usePathname()

    const { isMobile } = useWindowSize()

    if (!spotData || isMobile) return null
    return (
        <div
            className={cn('hidden absolute top-0 z-50 md:flex gap-4 pb-12 mx-6 pt-6 w-fit h-full overflow-y-scroll',
                !spotData.description && 'flex-col',
            )}>
            <header className={"flex flex-col bg-black/50 text-white backdrop-blur-[2px] rounded-[2.8rem] w-[35vw] md:max-w-3xl h-fit shadow-md"}>
                <div className={cn('flex items-center justify-between pl-8 pr-2 py-2',
                    spotData.description && 'border-b'
                )
                }>
                    <div className="flex items-center justify-start gap-4">
                        <div className='w-8 h-8 rounded-full border-4 border-white flex-shrink-0'
                            style={{ backgroundColor: spotData.color }}
                        />
                        <div className='flex flex-col items-start justify-center'>
                            <p className='text-xl hover:underline underline-offset-4 decoration-[2px] cursor-pointer'
                            >{spotData.name}</p>
                            <p className='text-base text-muted-foreground line-clamp-1'
                            >{spotData.address}</p>
                        </div>
                    </div>
                    <div className='flex items-center justify-center'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size={'sm'} variant="outline" className="w-16 h-16 rounded-full mr-2" onClick={() => NavigateToGoogleMaps(spotData.address)}>
                                        <Icon.Milestone className='w-8 h-8' strokeWidth={3} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Navigate with Google Maps</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <Button size={'sm'} variant="outline" className="w-16 h-16 rounded-full mr-2" onClick={() => router.push(pathname)}>
                            <Icon.Close className='w-8 h-8' strokeWidth={3} />
                        </Button>
                    </div>
                </div>
                {spotData.description && <div className='p-4 pb-8'>
                    <p className='text-base'>
                        {spotData.description}
                    </p>
                </div>}
            </header>
            {publicIds.length > 0 && <div className={"w-[35vw] md:max-w-3xl h-full flex flex-col gap-2 overflow-y-scroll"}>
                {publicIds.map((publicId) => (
                    <CldImage
                        key={publicId}
                        src={publicId}
                        width="0"
                        height="0"
                        sizes="100vw"
                        alt="Description of my image"
                        className={"w-full object-cover shadow-md rounded-[2.8rem] "}
                    />
                ))}
            </div>}
        </div>
    )
}

export default SideMenuBar