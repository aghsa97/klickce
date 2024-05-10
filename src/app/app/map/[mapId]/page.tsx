import React from 'react'

import { env } from '@/env';

import StyleFormSlider from '../_components/style-form-slider';
import SpotFormSlider from '../_components/spot-form-slider';
import { getProjectsByMapId, getSpotById } from '@/lib/queries/inedex';

const STYLE_TOKEN = env.MAPBOX_STYLE_API_TOKEN
const USERNAME = env.NEXT_PUBLIC_MAPBOX_USERNAME

async function MapFromPage({ params, searchParams }: { params: { mapId: string }, searchParams: any }) {

    if (searchParams.spotId) {
        const data = await getSpotById(searchParams.spotId)
        const projects = await getProjectsByMapId(params.mapId)
        if (!data) return null
        return (
            <div className='w-[500px] h-full overflow-y-auto p-4 flex flex-col border-r'>
                <SpotFormSlider data={data} projects={projects} />
            </div>
        )
    }

    const styles = await fetch(`https://api.mapbox.com/styles/v1/${USERNAME}?access_token=${STYLE_TOKEN}`)
        .then(res => res.json())
        .catch(err => console.log(err))
        .then(data => data.map((style: any) => style.id))
        .catch(err => console.log(err))

    if (!searchParams.styles || !styles) return null
    return (
        <div className='w-[350px] h-full overflow-y-auto p-4 flex flex-col border-r'>
            <StyleFormSlider styles={styles} />
        </div>
    )
}

export default MapFromPage