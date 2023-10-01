'use client'

import type { RouterOutputs } from '@/lib/api'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button, buttonVariants } from '@/components/ui/button'
import { useToastAction } from '@/hooks/use-toast-action'
import { Checkbox } from "@/components/ui/checkbox"
import { api } from '@/lib/trpc/client'

import ProjectPopover from './project-popover'
import SpotPopover from './spot-popover'
import EmptyState from './empty-state'


type ContentTabProps = {
    data: NonNullable<RouterOutputs["maps"]["getMapDataById"]>
}

function ContentTab({ data }: ContentTabProps) {
    const [selectedSpotsIds, setSelectedSpotsIds] = useState<string[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSelected, setSelected] = useState(false)
    const { toast } = useToastAction()
    const router = useRouter()

    function handleSelection(id: string) {
        if (selectedSpotsIds.includes(id)) {
            setSelectedSpotsIds(selectedSpotsIds.filter((spot) => spot !== id))
        } else {
            setSelectedSpotsIds([...selectedSpotsIds, id])
        }
    }

    async function handleDelete() {
        try {
            for (const id of selectedSpotsIds) {
                await api.spots.deleteSpot.mutate({ id })
                setIsDialogOpen(false)
            }
            toast('deleted', `Spot ${selectedSpotsIds.length > 1 ? 's' : ''} deleted`)
            setSelectedSpotsIds([])
            setSelected(false)
            router.refresh()
        } catch (error: any) {
            console.log(error); // TODO: handle error
            toast('error', error.message)
        }
    }

    async function handleUpdate(projectId: string) {
        try {
            for (const id of selectedSpotsIds) {
                await api.spots.updateSpot.mutate({ id, projectId })
            }
            toast('updated', `Spot ${selectedSpotsIds.length > 1 ? 's' : ''} updated`)
            setSelectedSpotsIds([])
            setSelected(false)
            router.refresh()
        } catch (error: any) {
            console.log(error); // TODO: handle error
            toast('error', error.message)
        }
    }

    if (!Boolean(data.projects.length) && !Boolean(data.spots.length)) return <EmptyState />;
    return (
        <div className='flex flex-col'>
            {data.projects.map((project, index) => (
                <div key={project.id} className='flex flex-col cursor-pointer group relative pb-2'>
                    <ProjectPopover index={index} data={project} projects={data.projects} />
                </div>
            ))}
            {/* Spots header goes here */}
            <div className='flex items-center justify-between pb-2'>
                <Button variant="outline" size="sm" onClick={() => setSelected(!isSelected)}>
                    Select
                </Button>
                <div className='flex items-center gap-2'>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger className={buttonVariants({ variant: "destructive", size: "sm" })} disabled={!isSelected}>Delete</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete your spots
                                    and remove your data from our servers.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="secondary" size="sm" onClick={() => setIsDialogOpen(!isDialogOpen)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" size="sm" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Select disabled={!isSelected} onValueChange={(projectId) => handleUpdate(projectId)}>
                        <SelectTrigger className="w-full min-w-[155px]">
                            <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {data.projects.map((project) => (
                                    <SelectItem key={project.id} value={project.id}>
                                        {project.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/* Locations with no projects goes here */}
            {data.spots.map((spot, index) => (
                <div key={index} className="h-full flex items-center justify-between gap-2">
                    {isSelected && <Checkbox key={index} onClick={() => handleSelection(spot.id)} />}
                    <SpotPopover data={spot} padding="p-2" />
                </div>
            ))}
        </div>
    )
}

export default ContentTab