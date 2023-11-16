'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import useUpdateSearchParams from '@/hooks/update-search-params';
import { RouterOutputs } from '@/server/api'
import * as Icon from '@/components/icons'
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';


type data = NonNullable<RouterOutputs["maps"]["getPublicMapById"]>

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
        <div className='flex flex-col md:flex-row items-start md:items-center justify-center absolute bottom-10 left-3'>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                {projectId && <div className='w-6 h-6 rounded-full border-3 border-white absolute -top-1 -left-1 z-10'
                    style={{ backgroundColor: projects.find((project) => project.id === projectId)?.color }}
                />}
                <PopoverTrigger asChild className='relative'>
                    <Button
                        size={'icon'}
                        className="w-14 h-14 bg-black/50 backdrop-blur-[2px] rounded-full cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Icon.Filter className='w-6 h-6 text-white' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='ml-3 bg-black/50 rounded-2xl backdrop-blur-[2px] border-none'>
                    <div className="grid grid-cols-1 gap-4">
                        {projects.map((project) => (
                            project.spots.length > 0 &&
                            <div key={project.id} className='group w-full flex items-center justify-start gap-4 cursor-pointer'
                                onClick={() => router.replace(
                                    `${pathname}?${updateSearchParams({
                                        projectId: projectId !== project.id ? project.id : null,
                                    })}`,
                                )}
                            >
                                <div className='w-6 h-6 rounded-full border-3 border-white shrink-0'
                                    style={{ backgroundColor: project.color, opacity: projectId === project.id ? 1 : 1 }}
                                />
                                <p className={cn(`text-white group-hover:text-primary capitalize`,
                                    projectId === project.id && 'text-primary'
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