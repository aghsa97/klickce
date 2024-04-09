'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from "framer-motion"

import * as Icon from '../icons'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { RouterOutputs } from '@/lib/api'
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
        <header className={cn("absolute z-[70] flex flex-col w-full md:w-[22vw] md:max-w-3xl h-fit md:mx-3 pt-3 px-2 md:px-0 rounded-2xl",
            isOpen && 'h-full pb-3 z-[70]'
        )}>
            <div className={cn('flex items-center justify-between bg-black/50 text-white backdrop-blur-[2px] pl-3 pr-2 py-2 rounded-2xl shadow-md',
                isOpen && 'rounded-b-none shadow-none'
            )}>
                <p className='text-3xl font-bold'>{name}</p>
                <Button size={'icon'} variant={'ghost'} className="rounded-full mr-3 p-2 cursor-pointer" onClick={() => { setIsOpen(!isOpen) }} asChild>
                    {!isOpen ?
                        <Icon.Menu className='size-6' strokeWidth={2} />
                        :
                        <Icon.Close className='size-6' strokeWidth={2} />
                    }
                </Button>
            </div>
            {isOpen && !selectedProject &&
                <motion.div
                    initial={{ opacity: 0.5, }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className='flex flex-col gap-3 bg-black/50 text-white backdrop-blur-[2px] pl-3 pr-2 h-full py-6 rounded-b-2xl overflow-y-auto shadow-2xl'>
                    <div className='border-b border-border/25 flex flex-col items-start gap-3 pb-3'>
                        <p className='text-2xl font-semibold'>Projects</p>
                        {projects.map((project) => (
                            <div key={project.id} className="flex items-center justify-start gap-3 pr-3">
                                <div className='size-6 rounded-full border-3 border-white flex-shrink-0'
                                    style={{ backgroundColor: project.color }}
                                />
                                <p className='text-xl hover:underline underline-offset-4 decoration-[2px] cursor-pointer'
                                    onClick={() => setSelectedProject(project)}
                                >{project.name}</p>
                            </div>
                        ))}
                    </div>
                    {spots.length > 0 && <div className='flex flex-col items-start justify-center gap-3'>
                        <p className='text-2xl font-semibold'>Spots</p>
                        {spots.map((spot) => (
                            <div key={spot.id} className="flex items-center justify-start gap-3"
                            >
                                <div className='size-6 rounded-full border-3 border-white flex-shrink-0'
                                    style={{ backgroundColor: spot.color }}
                                />
                                <div className='flex flex-col items-start justify-center'>
                                    <Link
                                        onClick={() => isMobile && setIsOpen(false)}
                                        href={`?spotId=${spot.id}`} className='text-xl hover:underline underline-offset-4 decoration-[2px] cursor-pointer'>
                                        {spot.name}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>}
                </motion.div>
            }
            {isOpen && selectedProject &&
                <div
                    className='flex flex-col gap-3 bg-black/50 text-white backdrop-blur-[2px] pl-3 pr-2 h-full py-6 rounded-b-2xl overflow-y-auto'>
                    <div className="flex flex-col items-start justify-center gap-3">
                        <div className='w-full flex items-center justify-between'>
                            <p className='text-3xl font-semibold' onClick={() => setSelectedProject(null)}>{selectedProject.name}</p>
                            <Button size={'icon'} variant={'ghost'} className="rounded-full mr-3 p-2 cursor-pointer" onClick={() => setSelectedProject(null)}>
                                <Icon.ArrowLeft className='size-6' strokeWidth={3} />
                            </Button>
                        </div>
                        <div className='flex flex-col items-start justify-center gap-3'>
                            {selectedProject.spots.length > 0 && selectedProject.spots.map((spot) => (
                                <div key={spot.id} className="flex items-center justify-start gap-3"
                                >
                                    <div className='size-6 rounded-full border-3 border-white flex-shrink-0'
                                        style={{ backgroundColor: selectedProject.color }}
                                    />
                                    <div className='flex flex-col items-start justify-center'>
                                        <Link
                                            onClick={() => isMobile && setIsOpen(false)}
                                            href={`?spotId=${spot.id}`} className='text-2xl hover:underline underline-offset-4 decoration-[2px] cursor-pointer'>
                                            {spot.name}
                                        </Link>
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