'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CldImage } from 'next-cloudinary'

import { Button } from '../ui/button'

import * as Icon from '@/components/icons'
import { RouterOutputs } from '@/server/api'
import { NavigateToGoogleMaps } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import useWindowSize from '@/hooks/use-window-size'

type data = NonNullable<RouterOutputs["maps"]["getPublicMapById"]>

type SideMenuBarProps = {
    spotData: data["spots"][0] | data["projects"][0]["spots"][0] | null | undefined,
    publicIds: string[],
}

function MobileDataBar({ spotData, publicIds }: SideMenuBarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { isMobile } = useWindowSize()
    const divRef = useRef<HTMLDivElement>(null)
    const [isScrolling, setScroll] = useState(false)

    // set the scroll to true when the user scrolls and false when the div is back to the original position
    useEffect(() => {
        const handleScroll = () => {
            if (divRef.current) {
                setScroll(divRef.current.scrollTop > 0)
            }
        }

        const scrollableDiv = divRef.current
        if (scrollableDiv) {
            scrollableDiv.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (scrollableDiv) {
                scrollableDiv.removeEventListener('scroll', handleScroll);
            }
        }
    }, [spotData, divRef, isMobile])

    if (!spotData || !isMobile) return null
    return (
        <div
            ref={divRef}
            className={`clip block px-2 ${isScrolling ? 'scrolled' : ""}`}>
            <header className={"flex flex-col gap-2 w-full h-full box-border"}
                style={{
                    paddingTop: "calc((var(--vh, 1vh) * 100) - 3px - 10px - (100vw - var(--sbw, 0px) - 20px) * .666)"
                }}
            >
                <div className={'flex flex-col bg-black/50 text-white backdrop-blur-[2px] rounded-[2.8rem] shadow-md'}>
                    <div className={"flex items-center justify-between pl-6 pr-2 py-2 border-b"}>
                        <div className="flex items-center justify-start gap-2">
                            <div className='w-6 h-6 rounded-full border-2 border-white flex-shrink-0'
                                style={{ backgroundColor: spotData.color }}
                            />
                            <div className='flex flex-col items-start justify-center'>
                                <p className='text-base md:text-xl hover:underline underline-offset-4 decoration-[2px] cursor-pointer'
                                >{spotData.name}</p>
                                <p className='text-xs md:text-base text-muted/50 dark:text-muted-foreground line-clamp-1'
                                >{spotData.address}</p>
                            </div>
                        </div>
                        <div className='flex items-center justify-center'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size={'sm'} variant="outline" className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black mr-2" onClick={() => NavigateToGoogleMaps(spotData.address)}>
                                            <Icon.Milestone className='w-8 h-8' strokeWidth={3} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Navigate with Google Maps</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Button size={'sm'} variant="outline" className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black mr-2" onClick={() => router.push(pathname)}>
                                <Icon.Close className='w-8 h-8' strokeWidth={3} />
                            </Button>
                        </div>
                    </div>
                    {spotData.description ? <p className='text-base p-4 pb-8'>
                        {spotData.description}
                    </p>
                        :
                        <div className='flex items-center justify-center p-4 pb-8 h-60'>
                            <p className='text-base text-muted-foreground'>
                                No description available
                            </p>
                        </div>
                    }
                </div>
                {publicIds.length > 0 && <div className={"w-full flex flex-col gap-2 rounded-[2.8rem] pb-6"}>
                    {publicIds.map((publicId) => (
                        <CldImage
                            key={publicId}
                            src={publicId}
                            width="0"
                            height="0"
                            sizes="100vw"
                            alt="Description of my image"
                            className={"w-full rounded-3xl object-cover shadow-md"}
                        />
                    ))}
                </div>}
            </header>
        </div>
    )
}

export default MobileDataBar