import React from 'react'
import { z } from 'zod';
import { notFound } from 'next/navigation';


import { cn } from '@/lib/utils';
import { api } from '@/lib/trpc/api'

import CloudinaryImg from './_components/cloudinary-img';


const searchParamsSchema = z.object({
    spotId: z.string().optional(),
})


async function Page(props: { params: { mapId: string }, searchParams: { [key: string]: string | string[] | undefined }; }) {
    const search = searchParamsSchema.safeParse(props.searchParams)

    if (!search.success) return notFound()

    const spotId = search.data.spotId

    const spot = spotId ? await api.spots.getSpotById.query({ spotIdSchema: { id: spotId }, mapIdSchema: { id: props.params.mapId } }) : null
    const project = spot && spot.projectId ? await api.projects.getProjectById.query({ id: spot.projectId }) : null
    const imgsIds = spot && spotId ? await api.images.getImagesBySpotId.query({ id: spotId }) : null

    const spotData = spot && { ...spot, color: project?.color ?? spot?.color }
    const publicIds = imgsIds ? imgsIds.map((img) => img.publicId) : []

    if (!spot || !spotData) return null
    return (
        <div className=''>
            <div
                className={cn('hidden absolute top-8 z-50 md:flex md:flex-col gap-4 pb-12 mx-6 pt-6 w-fit h-full overflow-y-scroll',
                    !spotData.description && 'flex-col',
                )}>
                <header className={"flex flex-col bg-black/50 text-white backdrop-blur-[2px] rounded-[2.8rem] w-[20vw] md:max-w-3xl h-fit shadow-md"}>
                    <div className={cn('flex items-center justify-between pl-8 pr-2 py-2',
                        spotData.description && 'border-b'
                    )
                    }>
                        <div className="flex items-center justify-start gap-4">
                            <div className='w-8 h-8 rounded-full border-4 border-white flex-shrink-0'
                                style={{ backgroundColor: spotData.color }}
                            />
                            <div className='flex flex-col items-start justify-center'>
                                <p className='text-xl hover:underline underline-offset-4 decoration-[2px] cursor-pointer'
                                >{spotData.name}</p>
                                <p className='text-base text-muted/50 dark:text-muted-foreground line-clamp-1'
                                >{spotData.address}</p>
                            </div>
                        </div>
                    </div>
                    {spotData.description && <div className='p-4 pb-8'>
                        <p className='text-base'>
                            {spotData.description}
                        </p>
                    </div>}
                </header>
                {publicIds.length > 0 && <div className={"w-[20vw] md:max-w-3xl h-full flex flex-col gap-2 overflow-y-scroll"}>
                    {publicIds.map((publicId) => (
                        <CloudinaryImg
                            key={publicId}
                            publicId={publicId}
                        />
                    ))}
                </div>}
            </div>
        </div>
    )
}

export default Page