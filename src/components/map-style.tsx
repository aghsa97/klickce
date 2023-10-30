'use client'

import Image from "next/image"
import { useTransition } from "react"

import { cn } from "@/lib/utils"
import { env } from "@/env"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/trpc/client"
import { toast } from "sonner"

type MapStyleProps = {
    styles: string[]
}

const STYLE_TOKEN = env.NEXT_PUBLIC_MAPBOX_API_TOKEN
const USERNAME = env.NEXT_PUBLIC_MAPBOX_USERNAME

function MapStyle({ styles }: MapStyleProps) {
    const router = useRouter()
    const params = useParams()
    const [_, startTransition] = useTransition()


    const handleUpdateMapStyle = (style: string) => {
        startTransition(async () => {
            try {
                await api.maps.updateMap.mutate({
                    id: params.mapId as string,
                    style: style,
                })
                toast.success('Map style updated')
                router.refresh()
            } catch (error: any) {
                console.log(error); // TODO: handle error
                toast.error(error.message)
            }
        })
    }

    return (
        <div className="flex flex-col items-center gap-3 rounded-xl">
            {Boolean(styles.length) &&
                styles.map((style) => (
                    <Image
                        key={style}
                        width="0"
                        height="0"
                        sizes="100vw"
                        alt="Map style"
                        onClick={() => handleUpdateMapStyle(style)}
                        className={cn(`w-full h-48 rounded-lg cursor-pointer`,
                            // styleClicked === style ? 'border-4 border-yellow-500' : 'border-none'
                        )}
                        src={`https://api.mapbox.com/styles/v1/${USERNAME}/${style}/static/-73.99,40.70,12/500x300?access_token=${STYLE_TOKEN}`}
                    />
                ))}
        </div>
    )
}

export default MapStyle