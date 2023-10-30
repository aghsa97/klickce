'use client'

import { useParams, useRouter } from 'next/navigation'


import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/trpc/client'

import * as Icon from '@/components/icons'
import { genId } from '@/server/db';
import { toast } from 'sonner'

function MapFormNavbar() {
    const router = useRouter()
    const params = useParams()

    async function handleClick() {
        try {
            await api.projects.createProject.mutate({
                name: "New project - " + genId().slice(0, 5), // add slugs names instead?
                mapId: params.mapId as string,
            })
            toast.success('Project created')
            router.refresh()
        } catch (error: any) {
            console.log(error); // TODO: handle error
            toast.error(error.message)
        }
    }
    return (
        <div className='flex items-center justify-between border-b border-border py-4'>
            <TabsList>
                <TabsTrigger value="content">
                    <Icon.Database />
                </TabsTrigger>
                <TabsTrigger value='customize'>
                    <Icon.Cog />
                </TabsTrigger>
                <TabsTrigger value='share'>
                    <Icon.Share />
                </TabsTrigger>
            </TabsList>
            <div className='flex items-center gap-2'>
                <Button variant={'outline'} className="w-full flex items-center justify-center gap-2"
                    onClick={handleClick}
                >
                    Add a project
                    <Icon.Plus />
                </Button>
            </div>
        </div>
    )
}

export default MapFormNavbar