'use client'

import Image from "next/image"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { env } from "@/env"

type MapStyleProps = {
    styles: string[]
    onClick: (styleID: string) => void
    defaultValue: string
}

const STYLE_TOKEN = env.NEXT_PUBLIC_MAPBOX_API_TOKEN
const USERNAME = env.NEXT_PUBLIC_MAPBOX_USERNAME

function MapStyle({ styles, onClick, defaultValue }: MapStyleProps) {
    const [styleClicked, setStyleClicked] = useState<string>(defaultValue)

    const toggleMapClicked = (style: string) => {
        setStyleClicked(style)
        onClick(style)
    }

    return (
        <div className="flex flex-col items-center gap-3 overflow-y-auto h-[500px] rounded-xl">
            {Boolean(styles.length) &&
                styles.map((style, index) => (
                    <Image
                        key={index}
                        width="0"
                        height="0"
                        sizes="100vw"
                        alt="Map style"
                        onClick={() => toggleMapClicked(style)}
                        className={cn(`w-full h-48 rounded-lg cursor-pointer`,
                            styleClicked === style ? 'border-4 border-yellow-500' : 'border-none'
                        )}
                        src={`https://api.mapbox.com/styles/v1/${USERNAME}/${style}/static/-73.99,40.70,12/500x300?access_token=${STYLE_TOKEN}`}
                    />
                ))}
        </div>
    )
}

export default MapStyle