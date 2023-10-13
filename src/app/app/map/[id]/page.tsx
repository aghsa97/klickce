import { api } from '@/lib/trpc/api'
import { notFound } from 'next/navigation'

import FormTabs from '../_components/tabs'
import FormSearch from '../_components/search'
import Slider from '../_components/slider'
import { env } from '@/env'

const STYLE_TOKEN = env.MAPBOX_STYLE_API_TOKEN
const USERNAME = env.NEXT_PUBLIC_MAPBOX_USERNAME

async function OnboardingPage(props: { params: { id: string } }) {
    const id = props.params.id
    const mapData = await api.maps.getMapDataById.query({ id })

    const styles = await fetch(`https://api.mapbox.com/styles/v1/${USERNAME}?access_token=${STYLE_TOKEN}`, { next: { revalidate: 3600 } })
        .then(res => res.json())
        .catch(err => console.log(err))
        .then(data => data.map((style: any) => style.id))
        .catch(err => console.log(err))


    if (!mapData) return notFound()
    return (
        <div className='flex h-full'>
            <div className='w-96 px-2 py-4 flex flex-col border-r'>
                <FormSearch />
                <FormTabs styles={styles} data={mapData} />
            </div>
            <Slider />
        </div>
    )
}

export default OnboardingPage