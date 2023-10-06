import { api } from '@/lib/trpc/api'
import { notFound } from 'next/navigation'

import FormTabs from '../_components/tabs'
import FormSearch from '../_components/search'
import Slider from '../_components/slider'
import { env } from '@/env'

const STYLE_TOKEN = env.KLICKCE_MAPBOX_API_TOKEN
const USERNAME = env.NEXT_PUBLIC_MAPBOX_USERNAME

async function OnboardingPage(props: { params: { mapId: string } }) {
    const mapData = await api.maps.getMapDataById.query({ id: props.params.mapId })

    const styles = await fetch(`https://api.mapbox.com/styles/v1/${USERNAME}?access_token=${STYLE_TOKEN}`)
        .then(res => res.json())
        .catch(err => console.log(err))
        .then(data => data.map((style: any) => style.id))
        .catch(err => console.log(err))


    if (!mapData) return notFound()

    return (
        <div className='flex h-full'>
            <div className='w-96 px-2 py-4 flex flex-col border-r'>
                <FormSearch mapId={props.params.mapId} />
                <FormTabs styles={styles} mapId={props.params.mapId} data={mapData} />
            </div>
            <Slider />
        </div>
    )
}

export default OnboardingPage