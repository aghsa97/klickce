import React from 'react'
import { notFound } from 'next/navigation'

import BrowseMap from '../_components/browse-map'
import MapMenu from '@/components/map/map-menu';
import ProjectsBar from '@/components/map/projects-bar';
import { getMapById } from '@/lib/queries/inedex';


async function MapLayout({ params, children }: { children: React.ReactNode, params: { mapId: string } }) {
    const mapId = params.mapId
    const data = await getMapById(mapId)

    if (!data) return notFound()
    return (
        <div className='relative h-dvh box-border overflow-hidden'
            style={{
                height: "calc(var(--vh, 1vh) * 100)",
            }}
        >
            <MapMenu name={data.name} projects={data.projects} spots={data.spots} />
            <BrowseMap data={data} />
            {children}
            <ProjectsBar projects={data.projects} />
        </div>
    )
}

export default MapLayout