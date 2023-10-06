'use client'

import React from 'react'
import { z } from 'zod';
import Link from 'next/link';
import { Badge } from "@nextui-org/react";
import { usePathname, useSearchParams } from 'next/navigation';

import { RouterOutputs } from '@/lib/api'
import { cn } from '@/lib/utils';


type data = NonNullable<RouterOutputs["maps"]["getMapById"]>

type ProjectsBarProps = {
    projects: data["projects"]
}

function ProjectsBar({ projects }: ProjectsBarProps) {
    const searchParams = useSearchParams()
    const projectId = searchParams.get('projectId')
    const pathname = usePathname()

    return (
        <div className='flex flex-col md:flex-row items-start md:items-center justify-center absolute bottom-10 left-4 md:left-8 gap-2'>
            {projects.map((project) => (
                <Badge
                    placement="top-right"
                    key={project.id}
                    variant='flat'
                    className='h-4 w-4 md:w-6 md:h-6 flex justify-center items-center border-2 md:border-2 border-white rounded-full text-background text-sm font-bold'
                    style={{ backgroundColor: project.color }}
                >
                    <Link href={project.id !== projectId ? `?projectId=${project.id}` : pathname}
                        className={cn(`w-40 h-10 md:w-full md:h-full flex justify-center items-center text-sm rounded-full p-2 md:px-6 md:py-3 bg-background/50 backdrop-blur-md cursor-pointer`,
                            project.id === projectId && 'bg-primary'
                        )}
                    >
                        {project.name}
                    </Link>
                </Badge>
            ))}
        </div>
    )
}

export default ProjectsBar