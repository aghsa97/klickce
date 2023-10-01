'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import * as Icon from '@/components/icons'
import { useMapStore } from '@/lib/store'
import { api } from '@/lib/trpc/client'

import SearchBox from '../../../components/location-search-bar'
import { useToastAction } from '@/hooks/use-toast-action'

function FormSearch({ mapId }: { mapId: string }) {
    const router = useRouter()
    const { zoom, setIsMovePin, isMovePin } = useMapStore()
    const [_, startTransition] = useTransition()
    const { toast } = useToastAction()

    const iconComp = zoom < 12 ? <Icon.MapPinOff /> : <Icon.MapPin onClick={() => setIsMovePin(!isMovePin)} />

    async function handleOnSelect(data: { location: { locationName: string, address: string }, lat: number | null, lng: number | null }) {
        startTransition(async () => {
            try {
                if (!data.lat || !data.lng) {
                    toast('error')
                    return // TODO: handle error
                }
                await api.spots.createSpot.mutate({
                    mapId,
                    address: data.location.address,
                    name: data.location.locationName,
                    lat: data.lat,
                    lng: data.lng,
                })
                toast('created')
                router.refresh()
            } catch (error) {
                console.log(error); // TODO: handle error
                toast('error')
            }
        })
    }


    return (
        <div className='flex items-center justify-between gap-2'>
            <SearchBox
                defaultValue=''
                onSelectAddress={(location, lat, lng) => handleOnSelect({ location, lat, lng })}
            />
            <Button className='rounded-lg' size={'default'} variant={'secondary'} disabled={zoom < 12}>
                {iconComp}
            </Button>
        </div>
    )
}

export default FormSearch