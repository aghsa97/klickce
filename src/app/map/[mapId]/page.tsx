import React from 'react'
import { notFound } from 'next/navigation';

import { api } from '@/lib/trpc/api'

import { z } from 'zod';
import SideMenuBar from '@/components/map/side-menu-bar';
import MobileDataBar from '@/components/map/mobile-data-bar';

export const revalidate = 900

const searchParamsSchema = z.object({
    spotId: z.string().optional(),
})

async function MapPage(props: { params: { mapId: string }, searchParams: { [key: string]: string | string[] | undefined }; }) {
    const search = searchParamsSchema.safeParse(props.searchParams)

    if (!search.success) return notFound()

    const spotId = search.data.spotId
    if (!spotId) return null

    const spot = await api.spots.getSpotById.query({ spotIdSchema: { id: spotId }, mapIdSchema: { id: props.params.mapId } })
    if (!spot) return null

    const project = spot.projectId ? await api.projects.getProjectById.query({ id: spot.projectId }) : null
    const imgsIds = await api.images.getImagesBySpotId.query({ id: spotId })

    const spotData = { ...spot, color: project?.color ?? spot?.color }
    const publicIds = imgsIds.map((img) => img.publicId)

    return (
        <>
            <SideMenuBar spotData={spotData} publicIds={publicIds} />
            <MobileDataBar spotData={spotData} publicIds={publicIds} />
        </>
    )
}

export default MapPage