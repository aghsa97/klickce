'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { CldImage } from 'next-cloudinary'

import { Button } from '../ui/button'

import * as Icon from '@/components/icons'
import { RouterOutputs } from '@/server/api'
import { cn, NavigateToGoogleMaps } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import useWindowSize from '@/hooks/use-window-size'

type data = NonNullable<RouterOutputs["maps"]["getPublicMapById"]>

type SideMenuBarProps = {
    spotData: data["spots"][0] | data["projects"][0]["spots"][0] | null | undefined,
    publicIds: string[],
}

function SideMenuBar({ spotData, publicIds }: SideMenuBarProps) {
    const router = useRouter()
    const pathname = usePathname()

    const { isMobile } = useWindowSize()

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);


    // Function to handle going to the next ID
    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % publicIds.length);
    };

    // Function to handle going to the previous ID
    const goToPrev = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex === 0) return publicIds.length - 1;
            return prevIndex - 1;
        });
    };

    useEffect(() => {
        setTimeout(() => {
            setCurrentIndex(0)
            setIsPlaying(true)
        }, 500)
    }, [spotData])

    if (!spotData || isMobile) return null
    return (
        <div
            className={cn('hidden absolute top-0 z-50 md:flex flex-col gap-2 w-full h-fit max-h-full py-1.5 px-1.5 md:w-[50vw] md:max-w-xl md:mx-3 md:py-3 md:px-0 2xl:w-[35vw]')}>
            <header className={"flex flex-col bg-black/50 text-white backdrop-blur-[2px] rounded-5xl h-fit shadow-md"}>
                <div className={cn('flex items-center justify-between pl-4 pr-2 py-2')}>
                    <div className="flex items-center justify-start gap-4">
                        <div className='w-8 h-8 rounded-full border-4 border-white flex-shrink-0'
                            style={{ backgroundColor: spotData.color }}
                        />
                        <div className='flex flex-col items-start justify-center'>
                            <p className='text-lg hover:underline underline-offset-4 decoration-[2px] cursor-pointer'
                            >{spotData.name}</p>
                            <p className='text-base text-muted/50 dark:text-muted-foreground line-clamp-1'
                            >{spotData.address}</p>
                        </div>
                    </div>
                    <div className='flex items-center justify-center gap-1'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size={'icon'} variant="outline" className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black"
                                        onClick={() => NavigateToGoogleMaps(spotData.address)}
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
                </div>
            </header>
            <div className={"h-full flex flex-col gap-2 overflow-y-scroll"}>
                {spotData.description && <div className={cn('flex flex-col items-start justify-start bg-black/50 text-white backdrop-blur-[2px] rounded-3xl shadow-md p-4 gap-1.5')}>
                    <h1 className='text-xl font-bold'>
                        Description
                    </h1>
                    <p className='text-base'>
                        {spotData.description}
                    </p>
                </div>}
                {publicIds.length > 0 && isPlaying && <div className="relative w-full mx-auto flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] rounded-3xl">
                    <div className="w-16 h-7 absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 text-white">
                        {publicIds.map((_, index) => (
                            <div
                                key={index}
                                className={cn('w-2 h-2 rounded-full', {
                                    'bg-white': index === currentIndex,
                                    'bg-white/50': index !== currentIndex,
                                })}
                            />
                        ))}
                    </div>
                    <div className="absolute top-2 right-20">
                        <Button
                            className="w-12 md:w-14 h-12 md:h-14 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-[2px] text-white"
                            size={'icon'}
                            onClick={goToPrev}
                        >
                            <Icon.ChevronLeft className='w-6 h-6 md:w-8 md:h-8' strokeWidth={3} />
                        </Button>
                    </div>
                    <CldImage
                        key={publicIds[currentIndex]}
                        src={publicIds[currentIndex]}
                        width="0"
                        height="0"
                        alt="Description of my image"
                        sizes="100vw"
                        className={"w-full h-fit object-cover shadow-md rounded-3xl"}
                        priority={currentIndex === 0} // Prefetch the first image
                    />
                    <div className="absolute top-2 right-4">
                        <Button
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-[2px] text-white"
                            size={'icon'}
                            onClick={goToNext}
                        >
                            <Icon.ChevronRight className='w-6 h-6 md:w-8 md:h-8' strokeWidth={3} />
                        </Button>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default SideMenuBar