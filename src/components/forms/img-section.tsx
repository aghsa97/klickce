'use client'

import { useEffect, useState, useTransition, type ChangeEvent } from 'react'
import { useParams } from 'next/navigation';
import Image from 'next/image';

import { CldImage } from 'next-cloudinary';

import { useToastAction } from '@/hooks/use-toast-action';
import { api } from '@/lib/trpc/client';
import { cn } from '@/lib/utils';

import { buttonVariants } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label'
import * as Icon from '../icons'

type ImageSectionProps = {
    spotId: string
}

function ImageSection({ spotId }: ImageSectionProps) {
    const { mapId } = useParams()
    const [isPending, startTransition] = useTransition()
    const [publicIds, setPublicIds] = useState<{ id: string, publicId: string }[]>([])
    const { toast } = useToastAction()

    useEffect(() => {
        function getPublicIds() {
            startTransition(async () => {
                const images = await api.images.getImagesBySpotId.query({ id: spotId })
                setPublicIds(images.map((img) => ({ id: img.id, publicId: img.publicId })))
            })
        }
        getPublicIds()
    }, [spotId])


    async function handleImgChange(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || !mapId) {
            toast('error')
            return; // TODO: add error handling
        }

        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    setPublicIds((prev) => [...prev, { id: "", publicId: 'loading' }])
                    startTransition(async () => {
                        try {
                            const result = await api.images.createImage.mutate({
                                url: e.target?.result as string,
                                mapId: mapId as string,
                                spotId,
                            })
                            setPublicIds((prev) => prev.filter((img) => img.publicId !== 'loading'))
                            setPublicIds((prev) => [...prev, { id: result.id, publicId: result.publicId }])
                            toast('created')
                        } catch (error: any) {
                            console.log(error); // TODO: handle error
                            toast('error', error.message)
                        }
                    })
                }
            };

            reader.readAsDataURL(file);
        }
    }
    async function handleDelete(id: string) {
        startTransition(async () => {
            try {
                await api.images.deleteImage.mutate({ id })
                setPublicIds((prev) => prev.filter((img) => img.id !== id))
                toast('deleted')
            } catch (error: any) {
                console.log(error); // TODO: handle error
                toast('error', error.message)
            }
        })
    }
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
                <Label>Images</Label>
                <Label className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}>
                    <span className='flex items-center gap-2'>
                        <Icon.Plus className='w-4 h-4' />
                        <span>Add image</span>
                    </span>
                    <Input
                        type="file"
                        name='file'
                        accept="image/*"
                        className="sr-only"
                        disabled={isPending}
                        onChange={handleImgChange}
                    />
                </Label>
            </div>
            <div className={cn('grid grid-flow-col grid-cols-2 grid-rows-2 gap-2 h-[400px]',
                !publicIds.length && 'border rounded-lg flex items-center justify-center')}>
                {!publicIds.length && !isPending && (<div className='flex flex-col items-center justify-center gap-2 text-center'>
                    <Image src='/empty-imgs.svg' alt='empty-state' width={0} height={0} className="w-40" />
                    <h1 className='text-sm text-muted-foreground'>Your spot has no images yet</h1>
                </div>
                )}
                {publicIds.map((img, index) => (
                    <div key={img.id} className={cn("relative min-h-[100px]",
                        publicIds.length === 1 ? 'col-span-2 row-span-2' : 'col-span-1',
                        index === 0 ? 'row-span-2' : 'row-span-1',
                        publicIds.length === 4 && 'col-span-1 row-span-1',
                    )}>
                        {img.publicId === "loading" ?
                            <div key={index} className="h-full w-full flex items-center justify-center border rounded-lg">
                                <Icon.Loader className='w-8 h-8 text-primary animate-spin' />
                            </div>
                            :
                            <CldImage
                                key={index}
                                src={img.publicId}
                                width="0"
                                height="0"
                                sizes="100vw"
                                alt="Description of my image"
                                className={"w-full h-full rounded-lg object-cover"}
                            />}
                        <Icon.Close
                            className='absolute top-2 right-2 p-1.5 w-8 h-8 text-white rounded-full bg-black/20 hover:bg-black/50 backdrop-filter backdrop-blur-[4px] cursor-pointer'
                            onClick={() => handleDelete(img.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ImageSection