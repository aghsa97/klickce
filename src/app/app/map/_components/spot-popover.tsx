'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { RouterOutputs } from '@/lib/trpc/client'
import useUpdateSearchParams from '@/hooks/update-search-params';

// TODO: fix types
type data = NonNullable<RouterOutputs["maps"]["getMapDataById"]>
type SpotPopoverProps = {
    data: data["spots"][0]
    color?: string
    padding?: 'p-1' | 'p-2'
}

function SpotPopover({ data, color, padding = 'p-1' }: SpotPopoverProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const spotId = searchParams.get('spotId')
    const updateSeachParams = useUpdateSearchParams()

    function handleOpenSlider() {
        if (spotId === data.id) {
            router.replace(
                `${pathname}?${updateSeachParams({
                    spotId: null
                })}`,
            )
        } else {
            router.replace(
                `${pathname}?${updateSeachParams({
                    spotId: data.id
                })}`,
            )
        }
    }

    return (
        <div className='w-full flex items-center justify-between cursor-pointer' onClick={handleOpenSlider}>
            <div className={`w-full hover:bg-secondary ${padding} rounded-lg`}>
                <li className='w-full flex items-center justify-start gap-2 item'>
                    <span className='h-5 min-w-[20px] rounded-full border-2 border-white' style={{
                        backgroundColor: color ?? data.color
                    }} />
                    <div className="flex flex-col items-start justify-start text-start">
                        <h1 className="text-sm line-clamp-1">{data.name}</h1>
                        <h4 className='text-xs text-muted-foreground line-clamp-1'>{data.address}</h4>
                    </div>
                </li>
            </div>
        </div>
    )
}

export default SpotPopover