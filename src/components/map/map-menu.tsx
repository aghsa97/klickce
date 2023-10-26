'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from "framer-motion"

import * as Icon from '../icons'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { RouterOutputs } from '@/server/api'
import { useSearchParams } from 'next/navigation'
import useWindowSize from '@/hooks/use-window-size'

type data = NonNullable<RouterOutputs["maps"]["getMapById"]>

type MapMenuProps = {
    name: string
    projects: data["projects"]
    spots: data["spots"]
}

function MapMenu({ name, projects, spots, }: MapMenuProps) {
    const [selectedProject, setSelectedProject] = React.useState<data["projects"][0] | null>(null)
    const [isOpen, setIsOpen] = React.useState<Boolean>(false)
    const searchParams = useSearchParams()
    const spotId = searchParams.get('spotId')

    const { isMobile } = useWindowSize()

    if (spotId && !isMobile) return null
    return (
        <header className={cn("absolute z-[70] flex flex-col w-full md:w-[35vw] md:max-w-3xl h-fit md:mx-6 pt-4 md:pt-6 px-2 md:px-0 rounded-[2.8rem]",
            isOpen && 'h-full pb-4 md:pb-6 z-[70]'
        )}>
            <div className={cn('flex items-center justify-between bg-black/50 text-white backdrop-blur-[2px] pl-6 md:pl-8 pr-2 py-2 rounded-[2.8rem] shadow-md',
                isOpen && 'rounded-b-none border-b shadow-none'
            )}>
                <p className='text-3xl md:text-5xl font-medium'>{name}</p>
                <Button size={'sm'} variant="outline" className="w-12 h-12 md:w-16 md:h-16 rounded-full mr-2 bg-black" onClick={() => { setIsOpen(!isOpen) }}>
                    {!isOpen ?
                        <Icon.Menu className='w-10 h-10' strokeWidth={3} />
                        :
                        <Icon.Close className='w-10 h-10' strokeWidth={3} />
                    }
                </Button>
            </div>
            {isOpen && !selectedProject &&
                <motion.div
                    initial={{ opacity: 0.5, }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className='flex flex-col gap-4 bg-black/50 text-white backdrop-blur-[2px] pl-6 md:pl-8 pr-2 h-full py-4 rounded-b-[2.8rem] overflow-y-auto'>
                    {projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-start gap-4 pr-2">
                            <div className='w-6 h-6 md:w-8 md:h-8 rounded-full border-2 md:border-4 border-white flex-shrink-0'
                                style={{ backgroundColor: project.color }}
                            />
                            <p className='text-3xl md:text-5xl hover:underline underline-offset-4 decoration-[2px] cursor-pointer'
                                onClick={() => setSelectedProject(project)}
                            >{project.name}</p>
                        </div>
                    ))}
                    {spots.length > 0 && <div className='flex flex-col items-start justify-center gap-2'>
                        {spots.map((spot) => (
                            <div key={spot.id} className="flex items-center justify-start gap-4"
                            >
                                <div className='w-6 h-6 md:w-8 md:h-8 rounded-full border-2 md:border-4 border-white flex-shrink-0'
                                    style={{ backgroundColor: spot.color }}
                                />
                                <div className='flex flex-col items-start justify-center'>
                                    <Link
                                        onClick={() => isMobile && setIsOpen(false)}
                                        href={`?spotId=${spot.id}`} className='text-xl md:text-3xl hover:underline underline-offset-4 decoration-[2px] cursor-pointer'>
                                        {spot.name}
                                    </Link>
                                    <p className='text-base md:text-xl text-muted/50 dark:text-muted-foreground line-clamp-1'
                                    >{spot.address}</p>
                                </div>
                            </div>
                        ))}
                    </div>}
                </motion.div>
            }
            {isOpen && selectedProject &&
                <div
                    className='flex flex-col gap-4 bg-black/50 text-white backdrop-blur-[2px] pl-6 md:pl-8 pr-2 h-full py-2 rounded-b-[3rem] overflow-y-auto'>
                    <div className="flex flex-col items-start justify-center gap-4">
                        <div className='w-full flex items-center justify-between'>
                            <p className='text-3xl md:text-5xl' onClick={() => setSelectedProject(null)}>{selectedProject.name}</p>
                            <Button size={'sm'} variant="outline" className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black mr-2" onClick={() => setSelectedProject(null)}>
                                <Icon.ArrowLeft className='w-10 h-10 cursor-pointer' strokeWidth={3} />
                            </Button>
                        </div>
                        <div className='flex flex-col items-start justify-center gap-4'>
                            {selectedProject.spots.length > 0 && selectedProject.spots.map((spot) => (
                                <div key={spot.id} className="flex items-center justify-start gap-4"
                                >
                                    <div className='w-6 h-6 md:w-8 md:h-8 rounded-full border-2 md:border-4 border-white flex-shrink-0'
                                        style={{ backgroundColor: selectedProject.color }}
                                    />
                                    <div className='flex flex-col items-start justify-center'>
                                        <Link
                                            onClick={() => isMobile && setIsOpen(false)}
                                            href={`?spotId=${spot.id}`} className='text-xl md:text-3xl hover:underline underline-offset-4 decoration-[2px] cursor-pointer'>
                                            {spot.name}
                                        </Link>
                                        <p className='text-base md:text-xl text-muted/50 dark:text-muted-foreground line-clamp-1'
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