'use client'

import { useState } from 'react'

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import ProjectVisibiltyBtn from '@/components/project-visibilty-btn'
import ProjectCollapse from '@/components/project-collapse'
import ProjectForm from '@/components/forms/project-form'
import { RouterOutputs } from '@/lib/trpc/client'
import * as Icon from '@/components/icons'

type data = NonNullable<RouterOutputs["maps"]["getMapDataById"]>
type ProjectPopoverProps = {
    index: number,
    data: data["projects"][0]
    projects: data["projects"]
}


function ProjectPopover({ data, index, projects }: ProjectPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)
    const eyeIcon = data.isVisible ? <Icon.Eye className='w-5 h-5 hidden group-hover:block' /> : <Icon.EyeOff className='w-5 h-5' />

    return (
        <div className='flex flex-col'>
            <div className='flex items-center justify-between'>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild className='hover:bg-secondary p-2 rounded-lg'>
                        <div className='w-full flex items-center gap-2'>
                            <Icon.FolderKanban />
                            <span className='text-sm font-medium'>{data.name}</span>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-full ml-2.5 min-w-[350px]">
                        <ProjectForm data={{
                            id: data.id,
                            name: data.name,
                            color: data.color,
                            isVisible: data.isVisible
                        }}
                            setIsOpen={setIsOpen}
                        />
                    </PopoverContent>
                </Popover>
                <ProjectVisibiltyBtn data={{ id: data.id, isVisible: data.isVisible }} eyeIcon={eyeIcon} />
            </div>
            <ProjectCollapse project={data} projects={projects} index={index} />
        </div>
    )
}

export default ProjectPopover