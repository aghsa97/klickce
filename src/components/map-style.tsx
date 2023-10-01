'use client'

import Image from "next/image"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

const STYLE_TOKEN = process.env.NEXT_PUBLIC_KLICKCE_MAPBOX_API_TOKEN
const USERNAME = process.env.NEXT_PUBLIC_MAPBOX_USERNAME

type MapStyleProps = {
    onClick: (styleID: string) => void
    defaultValue: string
}

function MapStyle({ onClick, defaultValue }: MapStyleProps) {
    const [styles, setStyles] = useState<string[]>([])
    const [mapClicked, setMapClicked] = useState<string>(defaultValue)

    const toggleMapClicked = (style: string) => {
        setMapClicked(style)
        onClick(style)
    }


    useEffect(() => {
        const getStyles = async () => {
            fetch(`https://api.mapbox.com/styles/v1/${USERNAME}?access_token=${STYLE_TOKEN}`)
                .then(res => res.json())
                .catch(err => console.log(err))
                .then(data => { setStyles(data.map((style: any) => style.id)) })
                .catch(err => console.log(err))
        }
        getStyles()
    }, [])


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
                            mapClicked === style ? 'border-4 border-yellow-500' : 'border-none'
                        )}
                        src={`https://api.mapbox.com/styles/v1/${USERNAME}/${style}/static/-73.99,40.70,12/500x300?access_token=${STYLE_TOKEN}`}
                    />
                ))}
        </div>
    )
}

export default MapStyle