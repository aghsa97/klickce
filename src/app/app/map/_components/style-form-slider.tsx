'use client'

import { usePathname, useRouter } from 'next/navigation'

import useUpdateSearchParams from '@/hooks/update-search-params'
import * as Icon from '@/components/icons'
import MapStyle from '@/components/map-style'

type Props = {
    styles: string[]
}

function StyleFormSlider({ styles }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const updateSearchParams = useUpdateSearchParams()

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
                <div className='flex items'>
                    <div className='flex flex-col gap-1.5'>
                        <h4 className="font-medium leading-none">Map Style</h4>
                        <p className="text-sm text-muted-foreground">
                            Choose a map style for your map.
                        </p>
                    </div>
                </div>
                <Icon.Close className='w-8 h-8 absolute top-4 right-4 cursor-pointer rounded-full p-2 bg-black/50 backdrop-blur-[2px]' onClick={() => router.replace(
                    `${pathname}?${updateSearchParams({
                        styles: null,
                        spotId: null,
                    })}`,
                )} />
            </div>
            <MapStyle styles={styles} />
        </div>
    )
}

export default StyleFormSlider