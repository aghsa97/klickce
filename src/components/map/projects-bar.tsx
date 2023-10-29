'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import useUpdateSearchParams from '@/hooks/update-search-params';
import { RouterOutputs } from '@/server/api'
import * as Icon from '@/components/icons'
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';


type data = NonNullable<RouterOutputs["maps"]["getMapById"]>

type ProjectsBarProps = {
    projects: data["projects"]
}

function ProjectsBar({ projects }: ProjectsBarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const projectId = searchParams.get('projectId')
    const updateSearchParams = useUpdateSearchParams()
    const [isOpen, setIsOpen] = React.useState<boolean>(false)

    return (
        <div className='flex flex-col md:flex-row items-start md:items-center justify-center absolute bottom-10 right-4 md:bottom-full md:top-12 md:right-6'>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                {projectId && <div className='w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white absolute top-0.5 md:-top-8 -left-1 z-10'
                    style={{ backgroundColor: projects.find((project) => project.id === projectId)?.color }}
                />}
                <PopoverTrigger asChild className='relative'>
                    <Button
                        asChild
                        className="bg-black/50 backdrop-blur-[2px] p-4 rounded-full cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Icon.Filter className='w-14 h-14 md:w-16 md:h-16 text-white' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='mr-4 md:mr-0 md:absolute -top-16 right-10 bg-black/50 rounded-3xl backdrop-blur-[2px] border-none'>
                    <div className="grid grid-cols-1 gap-4">
                        {projects.map((project) => (
                            <div key={project.id} className='group w-full flex items-center justify-start gap-8 cursor-pointer'
                                onClick={() => router.replace(
                                    `${pathname}?${updateSearchParams({
                                        projectId: projectId !== project.id ? project.id : null,
                                    })}`,
                                )}
                            >
                                <div className='w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white shrink-0'
                                    style={{ backgroundColor: project.color, opacity: projectId === project.id ? 1 : 0.5 }}
                                />
                                <p className={cn(`text-white/75 group-hover:text-white capitalize`,
                                    projectId === project.id && 'text-white'
                                )}>
                                    {project.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default ProjectsBar