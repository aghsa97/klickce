'use client'

import React, { useEffect, useState } from 'react'

import { CldImage } from 'next-cloudinary';

import { Button, buttonVariants } from '@/components/ui/button';
import * as Icon from '@/components/icons';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { api } from '@/lib/trpc/client';
import { useParams, useRouter } from 'next/navigation';

function ImageSlider({ images, spotId }: { images: { id: string, publicId: string }[], spotId: string }) {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const { mapId } = useParams()
    const [isPending, setIsPending] = useState(false)



    // Function to handle going to the next ID
    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // Function to handle going to the previous ID
    const goToPrev = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex === 0) return images.length - 1;
            return prevIndex - 1;
        });
    };

    async function uploadImageFile(acceptedFile: File) {
        try {
            const file = await new Promise<string | null>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result && typeof e.target.result === 'string') {
                        resolve(e.target.result);
                    } else {
                        resolve(null);
                    }
                };
                reader.readAsDataURL(acceptedFile);
            });

            if (!file) {
                throw new Error('Could not read file');
            }
            setIsPending(true)
            await api.images.createImage.mutate({
                mapId: mapId as string,
                url: file,
                spotId,
            });
            setIsPending(false)
            toast.success('Image uploaded successfully')
            router.refresh()
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.message === 'Maximum number of images reached' ?
                error.message :
                'Could not upload image, try again later.';
            toast.error(errorMessage);
            setIsPending(false)
        }
    }

    const handleImageDelete = async (id: string) => {
        try {
            await api.images.deleteImage.mutate({ id })
            toast.success('Image deleted successfully')
            setCurrentIndex(0)
            router.refresh()
        } catch (error: any) {
            console.log(error); // TODO: handle error
            toast.error(error.message)
        }
    }

    useEffect(() => {
        setCurrentIndex(0)
        setTimeout(() => {
            setIsPlaying(true)
        }, 500)
    }, [images])

    return (
        <div className='group relative'>
            {isPending && <div className="absolute z-50 w-full h-full flex flex-col items-center justify-center gap-3 bg-black/50 backdrop-blur-[2px] rounded-3xl">
                <Icon.Loader className="w-8 h-8 animate-spin" />
            </div>}
            {images.length > 0 && isPlaying && <div className="relative w-full mx-auto flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] rounded-3xl">
                <div className="w-16 h-7 absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 text-white">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={cn('w-2 h-2 rounded-full', {
                                'bg-white': index === currentIndex,
                                'bg-white/50': index !== currentIndex,
                            })}
                        />
                    ))}
                </div>
                <div className="absolute top-2 left-4">
                    <Button
                        className="w-12 md:w-14 h-12 md:h-14 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-[2px] text-white"
                        size={'icon'}
                        onClick={goToPrev}
                    >
                        <Icon.ChevronLeft className='w-6 h-6 md:w-8 md:h-8' strokeWidth={3} />
                    </Button>
                </div>
                <CldImage
                    key={images[currentIndex].id}
                    src={images[currentIndex].publicId}
                    width="0"
                    height="0"
                    alt="Description of my image"
                    sizes="100vw"
                    className={"w-full h-fit object-cover shadow-md rounded-3xl"}
                    priority
                />
                <div className="absolute top-2 right-4 flex items-center justify-start gap-1">
                    <label
                        className={cn(buttonVariants({ size: "icon", variant: "default" }), "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-[2px] text-white cursor-pointer")}
                    >
                        <Icon.Image className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
                        <input id="file-upload" name="file-upload" type="file" className="sr-only"
                            accept="image/png, image/jpeg"
                            onChange={(e) => {
                                if (e.target.files) {
                                    uploadImageFile(e.target.files[0])
                                }
                            }}
                        />
                    </label>
                    <Button
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-[2px] text-white"
                        size={'icon'}
                        onClick={() => handleImageDelete(images[currentIndex].id)}
                    >
                        <Icon.Trash className='w-6 h-6 md:w-8 md:h-8' strokeWidth={3} />
                    </Button>
                    <Button
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-[2px] text-white"
                        size={'icon'}
                        onClick={goToNext}
                    >
                        <Icon.ChevronRight className='w-6 h-6 md:w-8 md:h-8' strokeWidth={3} />
                    </Button>
                </div>
            </div>}
        </div>
    )
}

export default ImageSlider