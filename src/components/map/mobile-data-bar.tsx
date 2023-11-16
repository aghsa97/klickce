'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
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

function MobileDataBar({ spotData, publicIds }: SideMenuBarProps) {
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
            className={`clip block px-2 py-1.5 ${isScrolling ? 'scrolled' : ""}`}>
            <header className={"flex flex-col  gap-2 w-full h-full box-border"}
                style={{
                    paddingTop: "calc((var(--vh, 1vh) * 100) - 3px - 10px - (100vw - var(--sbw, 0px) - 20px) * .666)"
                }}
            >
                {spotData.description && <div className={cn('flex flex-col items-start justify-start bg-black/50 text-white backdrop-blur-[2px] rounded-2xl shadow-md p-4 gap-1.5'
                    , !isScrolling && 'h-full'
                )}>
                    <h1 className='text-xl font-bold'>
                        Description
                    </h1>
                    <p className='text-base'>
                        {spotData.description}
                    </p>
                </div>}
                {publicIds.length > 0 && <div className={"w-full flex flex-col gap-2 rounded-2xl pb-1.5"}>
                    {publicIds.map((publicId) => (
                        <CldImage
                            key={publicId}
                            src={publicId}
                            width="0"
                            height="0"
                            sizes="100vw"
                            alt="Description of my image"
                            className={"w-full object-cover rounded-2xl shadow-md"}
                        />
                    ))}
                </div>}
            </header>
        </div>
    )
}

export default MobileDataBar