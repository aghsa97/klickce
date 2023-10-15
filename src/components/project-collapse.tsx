'use client'

import { useState } from 'react'

import { RouterOutputs } from '@/lib/api'
import { cn } from '@/lib/utils'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { Button } from './ui/button'
import * as Icon from './icons'
import SpotPopover from '@/app/app/map/_components/spot-popover'

type data = NonNullable<RouterOutputs["maps"]["getMapDataById"]>
type ProjectSpotsCollapseProps = {
    index: number,
    project: data["projects"][0],
    projects: data["projects"],
}

function ProjectCollapse({ project, projects, index }: ProjectSpotsCollapseProps) {
    const [projectCollapsibleStates, setProjectCollapsibleStates] = useState<boolean[]>(projects.map(() => false))

    const toggleProjectCollapsible = (index: number) => {
        setProjectCollapsibleStates((prev) => {
            const next = [...prev]
            next[index] = !next[index]
            return next
        })
    }
    return (
        <ul className="main border-b pb-2">
            <Collapsible
                open={projectCollapsibleStates[index]} // Use the project-specific state
                onOpenChange={() => toggleProjectCollapsible(index)}
                className="pl-8"
            >
                <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between">
                        <li className="flex items-center gap-2 text-sm font-semibold pl-2 items">
                            <div className='w-5 h-5 rounded-full border-2 border-white bg-blue-500' style={{
                                backgroundColor: project.color
                            }} />
                            {project.spots.length} {project.spots.length === 1 ? 'spot' : 'spots'}
                        </li>
                        <Button variant="ghost" size="sm">
                            <Icon.ArrowRight className={cn("h-5 w-5",
                                projectCollapsibleStates[index] ? "transform rotate-90 duration-150 ease-linear" : "transform rotate-0 duration-150 ease-linear"
                            )} />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col">
                    <ul className="sub-menu">
                        {project.spots.map((spot) => (
                            <div key={spot.id}>
                                <SpotPopover data={spot} color={project.color} />
                            </div>
                        ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        </ul>
    )
}

export default ProjectCollapse