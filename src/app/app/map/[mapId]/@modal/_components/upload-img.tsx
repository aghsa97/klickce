'use client'

import { useDropzone } from 'react-dropzone';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/trpc/client';
import { Progress } from '@/components/ui/progress';
import * as Icon from '@/components/icons';

function UploadImagesInput({ spotId }: { spotId: string }) {
    const router = useRouter()
    const { mapId } = useParams()
    const [isPending, setIsPending] = useState(false)
    const [progress, setProgress] = useState(0)

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

            await api.images.createImage.mutate({
                mapId: mapId as string,
                url: file,
                spotId,
            });

        } catch (error: any) {
            console.error(error);
            setIsPending(false);
            const errorMessage = error.message === 'Maximum number of images reached' ?
                error.message :
                'Could not upload image, try again later.';
            toast.error(errorMessage);
        }
    }

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 4) {
            toast.error('You can only upload 4 images at a time');
            return;
        }

        if (acceptedFiles.some(file => !file.type.includes('image'))) {
            toast.error('You can only upload images');
            return;
        }

        setIsPending(true);
        for (const file of acceptedFiles) {
            await uploadImageFile(file);
            setProgress((prev) => prev + 100 / acceptedFiles.length);
        }
        setIsPending(false);

        toast.success('Images uploaded successfully');
        router.refresh();
    }


    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    return (
        <div {...getRootProps()} className="flex justify-center rounded-3xl px-6 py-10 bg-black/50 backdrop-blur-[2px]">
            {isPending ?
                <div className="w-full flex flex-col items-center justify-center gap-3">
                    <Icon.Loader className="w-8 h-8 animate-spin" />
                    <Progress value={progress} className="w-[60%]" />
                </div>
                :
                <div className="text-center">
                    <div className="mt-4 flex text-sm leading-6 text-white">
                        <label className="relative cursor-pointer rounded-md font-semibold text-primary hover:text-primary/80">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" {...getInputProps()}
                                accept="image/png, image/jpeg"
                            />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, up to 10MB <br /> max 4 images</p>
                </div>}
        </div>
    )
}

export default UploadImagesInput