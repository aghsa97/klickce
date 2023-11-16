'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from "framer-motion"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { cn, NavigateToGoogleMaps } from '@/lib/utils'
import { RouterOutputs } from '@/server/api'
import useWindowSize from '@/hooks/use-window-size'

import * as Icon from '../icons'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

type data = NonNullable<RouterOutputs["maps"]["getPublicMapById"]>

type MapMenuProps = {
    name: string
    projects: data["projects"]
    spots: data["spots"]
}

function MapMenu({ name, projects, spots }: MapMenuProps) {
    const [selectedProject, setSelectedProject] = React.useState<data["projects"][0] | null>(null)
    const [isOpen, setIsOpen] = React.useState<Boolean>(false)
    const searchParams = useSearchParams()
    const spotId = searchParams.get('spotId')
    const router = useRouter()
    const pathname = usePathname()

    const { isMobile } = useWindowSize()

    if (spotId && !isMobile) return null

    const spotData = spots.find((spot) => spot.id === spotId) ?? projects.map((project) => project.spots).flat().find((spot) => spot.id === spotId)
    // find the project that the spot belongs to and change the color of the spot to the color of the project
    if (spotData) {
        const project = projects.find((project) => project.spots.find((spot) => spot.id === spotId))
        if (project) spotData.color = project.color
    }

    if (isMobile && spotData) return (
        <header className={cn("absolute z-[70] flex flex-col w-full h-fit py-1.5 px-1.5 md:w-[50vw] md:max-w-xl md:mx-3 md:py-3 md:px-0 2xl:w-[35vw]",
            isOpen && 'h-full max-h-full'
        )}
        >
            <div className={'flex items-center justify-between bg-black/50 text-white backdrop-blur-[2px] rounded-4xl shadow-md'}>
                <div className={"flex items-center justify-between pl-4 pr-2 py-3"}>
                    <div className="flex items-center justify-start gap-2">
                        <div className='w-6 h-6 rounded-full border-3 border-white flex-shrink-0'
                            style={{ backgroundColor: spotData.color }}
                        />
                        <div className='flex flex-col items-start justify-center'>
                            <p className='text-sm md:text-xl hover:underline underline-offset-4 decoration-[2px] cursor-pointer'
                            >{spotData.name}</p>
                            <p className='text-xs md:text-base text-muted/50 dark:text-muted-foreground line-clamp-1'
                            >{spotData.address}</p>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-center gap-1'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size={'icon'} variant="outline" className="w-12 h-12 rounded-full bg-black"
                                    onClick={() => NavigateToGoogleMaps(spotData.address)}
                                >
                                    <Icon.Milestone className='w-6 h-6' strokeWidth={3} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Navigate with Google Maps</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button size={'icon'} variant="outline" className="w-12 h-12 rounded-full bg-black mr-2"
                        onClick={() => router.push(pathname)}
                    >
                        <Icon.Close className='w-6 h-6' strokeWidth={3} />
                    </Button>
                </div>
            </div>
        </header>
    )
    return (
        <header className={cn("absolute z-[70] flex flex-col w-full h-fit py-1.5 px-1.5 md:w-[50vw] md:max-w-xl md:mx-3 md:py-3 md:px-0 2xl:w-[35vw]",
            isOpen && 'h-full max-h-full'
        )}
        >
            <div className={cn('flex items-center justify-between bg-black/50 text-white backdrop-blur-[2px] pl-6 pr-2 py-1.5 md:py-2 rounded-4xl shadow-md md:pl-8 md:rounded-5xl',
                isOpen && 'rounded-b-none md:rounded-b-none border-b shadow-none'
            )}>
                <p className='text-2xl font-bold md:text-3xl'>{name}</p>
                <Button size="icon" variant="outline" className="w-12 h-12 rounded-full mr-2 bg-black md:w-14 md:h-14" onClick={() => { setIsOpen(!isOpen) }}>
                    {!isOpen ?
                        <Icon.Menu className='w-6 h-6 md:w-8 md:h-8' strokeWidth={3} />
                        :
                        <Icon.Close className='w-6 h-6 md:w-8 md:h-8' strokeWidth={3} />
                    }
                </Button>
            </div>
            {isOpen && !selectedProject &&
                <motion.div
                    initial={{ opacity: 0.5, }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className='h-full flex flex-col gap-4 bg-black/50 text-white backdrop-blur-[2px] pl-6 pr-2 py-4 rounded-b-4xl overflow-y-auto md:pl-8 md:rounded-b-5xl'>
                    {projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-start gap-4 pr-2">
                            <div className='w-6 h-6 rounded-full border-3 border-white flex-shrink-0'
                                style={{ backgroundColor: project.color }}
                            />
                            <p
                                className='text-2xl font-bold hover:underline underline-offset-4 decoration-[2px] cursor-pointer capitalize md:text-3xl'
                                onClick={() => setSelectedProject(project)}
                            >{project.name}</p>
                        </div>
                    ))}
                    {spots.length > 0 && <div className='flex flex-col items-start justify-center gap-2'>
                        {spots.map((spot) => (
                            <div key={spot.id} className="flex items-center justify-start gap-4"
                            >
                                <div className='w-6 h-6 rounded-full border-3 border-white flex-shrink-0'
                                    style={{ backgroundColor: spot.color }}
                                />
                                <div className='flex flex-col items-start justify-center'>
                                    <Link
                                        onClick={() => isMobile && setIsOpen(false)}
                                        href={`?spotId=${spot.id}`}
                                        className='text-xl font-bold hover:underline underline-offset-4 decoration-[2px] cursor-pointer md:text-2xl'>
                                        {spot.name}
                                    </Link>
                                    <p className='text-base text-muted/50 dark:text-muted-foreground line-clamp-1 md:text-xl'
                                    >{spot.address}</p>
                                </div>
                            </div>
                        ))}
                    </div>}
                </motion.div>
            }
            {isOpen && selectedProject &&
                <div
                    className='flex flex-col gap-4 bg-black/50 text-white backdrop-blur-[2px] pl-6 md:pl-8 pr-2 h-full py-2 rounded-b-4xl overflow-y-auto md:rounded-b-5xl'>
                    <div className="flex flex-col items-start justify-center gap-4">
                        <div className='w-full flex items-center justify-between'>
                            <p className='text-2xl font-bold capitalize md:text-3xl' onClick={() => setSelectedProject(null)}>{selectedProject.name}</p>
                            <Button size={'icon'} variant="outline" className="w-12 h-12 rounded-full bg-black mr-2 md:w-14 md:h-14" onClick={() => setSelectedProject(null)}>
                                <Icon.ArrowLeft className='w-6 h-6 cursor-pointer md:w-8 md:h-8' strokeWidth={3} />
                            </Button>
                        </div>
                        <div className={cn('flex flex-col items-start justify-center gap-3',
                            selectedProject.spots.length > 0 && 'pb-6'
                        )}>
                            {selectedProject.spots.length > 0 && selectedProject.spots.map((spot) => (
                                <div key={spot.id} className="flex items-center justify-start gap-4"
                                >
                                    <div className='w-6 h-6 rounded-full border-3 border-white flex-shrink-0'
                                        style={{ backgroundColor: selectedProject.color }}
                                    />
                                    <div className='flex flex-col items-start justify-center'>
                                        <Link
                                            onClick={() => isMobile && setIsOpen(false)}
                                            href={`?spotId=${spot.id}`}
                                            className='text-xl font-bold hover:underline underline-offset-4 decoration-[2px] cursor-pointer capitalize md:text-2xl'>
                                            {spot.name}
                                        </Link>
                                        <p className='text-base text-muted/50 dark:text-muted-foreground line-clamp-1 md:text-xl'
                                        >{spot.address}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        </header>
    )
}

export default MapMenu