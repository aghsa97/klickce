'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Marker } from 'react-map-gl'

import type { RouterOutputs } from '@/server/api'
import { CldImage } from 'next-cloudinary'
import { api } from '@/lib/trpc/client';

type data = NonNullable<RouterOutputs["maps"]["getPublicMapById"]>

type ImgPopoverProps = {
    data: data["spots"]
    projectColor?: string
}

function ImgPopover({ data, projectColor }: ImgPopoverProps) {
    const [hoveredMarkerPics, setHoveredMarkerPics] = useState<string[] | null>(null)
    const [popupInfo, setPopupInfo] = useState<data["spots"][0] | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const router = useRouter()
    const searchParams = useSearchParams()
    const spotId = searchParams.get('spotId')
    const projectId = searchParams.get('projectId')


    useEffect(() => {
        let timer: NodeJS.Timeout;
        // If hovered and there are images, start a timer to change the image
        if (popupInfo && hoveredMarkerPics?.length) {
            timer = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hoveredMarkerPics.length);
            }, 2000); // Change image every 2 seconds
        }
        // Clean up the timer when the component is unmounted or when hovered is false
        return () => clearInterval(timer);
    }, [popupInfo, hoveredMarkerPics]);

    async function getHoveredMarkerPics(id: string) {
        try {
            const result = await api.images.getImagesBySpotId.query({ id })
            if (result.length > 0) {
                setHoveredMarkerPics(result.map((img) => img.publicId))
            }
            return result
        } catch (error) {
            console.log(error)
        }
    }

    function resetStates() {
        setPopupInfo(null)
        setCurrentImageIndex(0)
        setHoveredMarkerPics(null)
    }
    const handleMouseEnter = useCallback(async (spot: data["spots"][0]) => {
        // Reset states
        resetStates()

        // Set the new popup info
        setPopupInfo(spot);

        // Fetch the images
        await getHoveredMarkerPics(spot.id);
    }, []);


    function handleOnMarkerClick() {
        if (popupInfo) {
            router.push(`?spotId=${popupInfo.id}${projectId ? `&projectId=${projectId}` : ''}`)
        }
        return
    }


    return (
        <div
            className='w-full h-full'
            onMouseLeave={resetStates}
            onClick={handleOnMarkerClick}
        >
            {data.map((spot) => (
                <Marker
                    key={spot.id}
                    latitude={spot.lat}
                    longitude={spot.lng}
                >
                    <div className={'w-5 h-5 border-2 border-white rounded-full cursor-pointer relative z-50 flex items-center justify-center'}
                        style={{ backgroundColor: projectColor ?? spot.color }}
                        onMouseEnter={async () => await handleMouseEnter(spot)}
                        onClick={() => router.push(`?spotId=${spot.id}${projectId ? `&projectId=${projectId}` : ''}`)}
                    >
                        {spotId === spot.id && <motion.div
                            animate={{ scale: [0, 1.3], opacity: [0, 0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                            className={'absolute w-10 h-10 rounded-full cursor-pointer z-40'}
                            style={{ backgroundColor: projectColor ?? spot.color }}
                        />}
                    </div>
                    {popupInfo && hoveredMarkerPics && (
                        <Marker
                            anchor="bottom-left"
                            latitude={popupInfo.lat}
                            longitude={popupInfo.lng}
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.2 }}
                                className="relative z-10 right-6 top-6 w-72 h-52"
                            >
                                <div className="w-full h-2/3 absolute rounded-t-3xl bg-gradient-to-b from-black/70 backdrop-blur-sm backdrop-opacity-20" />
                                <p className=" absolute px-4 py-2 text-3xl font-medium text-white">{popupInfo.name}</p>
                                <CldImage
                                    src={hoveredMarkerPics[currentImageIndex]}
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    alt="Description of my image"
                                    className={"w-full h-full rounded-3xl object-cover"}
                                />
                            </motion.div>
                        </Marker>
                    )}
                </Marker>
            ))
            }
        </div>
    )
}

export default ImgPopover