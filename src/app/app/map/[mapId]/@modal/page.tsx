import React from 'react'
import { z } from 'zod';
import { notFound } from 'next/navigation';

import { api } from '@/lib/trpc/api'

import MenuBtns from './_components/menu-buttons';
import ImageSlider from './_components/image-slider';
import SpotNameForm from '@/components/forms/spot-name';
import UploadImagesInput from './_components/upload-img';
import SpotDescriptionForm from '@/components/forms/spot-description';

const searchParamsSchema = z.object({
    spotId: z.string().optional(),
})


async function Page(props: { params: { mapId: string }, searchParams: { [key: string]: string | string[] | undefined }; }) {
    const search = searchParamsSchema.safeParse(props.searchParams)

    if (!search.success) return notFound()

    const spotId = search.data.spotId

    if (!spotId) return null
    const spot = await api.spots.getSpotById.query({ spotIdSchema: { id: spotId }, mapIdSchema: { id: props.params.mapId } })

    if (!spot) return null
    const project = await api.projects.getProjectById.query({ id: spot.projectId })
    const imgsIds = await api.images.getImagesBySpotId.query({ id: spotId })

    const spotData = { ...spot, color: project?.color ?? spot?.color }
    const images = imgsIds?.map(img => ({ id: img.id, publicId: img.publicId }))

    return (
        <div
            className='hidden absolute top-12 z-50 md:flex flex-col gap-2 w-full h-fit max-h-full md:w-[50vw] md:max-w-xl md:mx-3 md:pb-16 2xl:w-[35vw]'>
            <header className={"flex flex-col bg-black/50 text-white backdrop-blur-[2px] rounded-5xl h-fit shadow-md"}>
                <div className='flex items-center justify-between pl-4 pr-2 py-2'>
                    <div className="flex items-center justify-start gap-4">
                        <div className='w-8 h-8 rounded-full border-4 border-white flex-shrink-0'
                            style={{ backgroundColor: spotData.color }}
                        />
                        <div className='flex flex-col items-start justify-center'>
                            <SpotNameForm spot={spotData} />
                            <p className='text-base text-muted/50 dark:text-muted-foreground line-clamp-1'
                            >{spotData.address}</p>
                        </div>
                    </div>
                    <MenuBtns address={spotData.address} />
                </div>
            </header>
            <div className={"h-full flex flex-col gap-2 overflow-y-scroll"}>
                <div className='h-full flex flex-col items-start justify-start bg-black/50 text-white backdrop-blur-[2px] rounded-3xl shadow-md p-4 gap-1.5'>
                    <h1 className='text-xl font-bold'>
                        Description
                    </h1>
                    <SpotDescriptionForm spot={spotData} />
                </div>
                {images.length > 0 ?
                    <ImageSlider images={images} spotId={spotId} />
                    :
                    <UploadImagesInput spotId={spotId} />
                }
            </div>
        </div>
    )
}

export default Page