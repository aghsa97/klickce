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
    const imgsIds = spotId && await api.images.getImagesBySpotId.query({ id: spotId })
    const publicIds = imgsIds ? imgsIds.map((img) => img.publicId) : []

    if (!spot) return null
    return (
        <>
            <SideMenuBar spotData={spot} publicIds={publicIds} />
            <MobileDataBar spotData={spot} publicIds={publicIds} />
        </>
    )
}

export default MapPage