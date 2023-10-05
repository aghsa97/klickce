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

    const spot = spotId ? await api.spots.getSpotById.query({ spotIdSchema: { id: spotId }, mapIdSchema: { id: props.params.mapId } }) : null
    const project = spot && spot.projectId ? await api.projects.getProjectById.query({ id: spot.projectId }) : null
    const imgsIds = spot && spotId ? await api.images.getImagesBySpotId.query({ id: spotId }) : null

    const spotData = spot && { ...spot, color: project?.color ?? spot?.color }
    const publicIds = imgsIds ? imgsIds.map((img) => img.publicId) : []

    if (!spot) return null
    return (
        <>
            <SideMenuBar spotData={spotData} publicIds={publicIds} />
            <MobileDataBar spotData={spotData} publicIds={publicIds} />
        </>
    )
}

export default MapPage