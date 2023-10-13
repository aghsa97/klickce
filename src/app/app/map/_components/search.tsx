'use client'

import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import * as Icon from '@/components/icons'
import { useMapStore } from '@/lib/store'
import { api } from '@/lib/trpc/client'


import { useToastAction } from '@/hooks/use-toast-action'
import SearchBox from '@/components/location-search-bar'



function FormSearch() {
    const router = useRouter()
    const { id: mapId } = useParams()
    const { toast } = useToastAction()
    const { zoom, setIsMovePin, isMovePin } = useMapStore()


    const iconComp = zoom < 12 ? <Icon.MapPinOff /> : <Icon.MapPin onClick={() => setIsMovePin(!isMovePin)} />

    async function handleOnSelect(data: { location: { locationName: string, address: string }, lat: number | null, lng: number | null }) {
        try {
            if (!data.lat || !data.lng) return
            await api.spots.createSpot.mutate({
                name: data.location.locationName,
                address: data.location.address,
                lat: data.lat,
                lng: data.lng,
                mapId: mapId as string,
            })
            toast('created', `Spot created with name ${data.location.locationName}`)
            router.refresh()
        } catch (error: any) {
            console.log(error); // TODO: handle error
            toast('error', error.message)
        }
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