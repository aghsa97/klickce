import { api } from '@/lib/trpc/api'
import { notFound } from 'next/navigation'

import FormTabs from '../_components/tabs'
import FormSearch from '../_components/search'
import Slider from '../_components/slider'



async function OnboardingPage(props: { params: { mapId: string } }) {
    const mapData = await api.maps.getMapDataById.query({ id: props.params.mapId })
    if (!mapData) return notFound()

    return (
        <div className='flex h-full'>
            <div className='w-96 px-2 py-4 flex flex-col border-r'>
                <FormSearch mapId={props.params.mapId} />
                <FormTabs mapId={props.params.mapId} data={mapData} />
            </div>
            <Slider />
        </div>
    )
}

export default OnboardingPage