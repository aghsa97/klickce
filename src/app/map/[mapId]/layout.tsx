import React from 'react'
import { notFound } from 'next/navigation'

import { api } from '@/lib/trpc/api'
import BrowseMap from '../_components/browse-map'
import MapMenu from '@/components/map/map-menu';
import ProjectsBar from '@/components/map/projects-bar';


async function MapLayout({ params, children }: { children: React.ReactNode, params: { mapId: string } }) {
    const mapId = params.mapId
    const data = await api.maps.getMapById.query({ id: mapId })

    if (!data) return notFound()
    return (
        <div className='relative min-h-full box-border'
        >
            <MapMenu name={data.name} projects={data.projects} spots={data.spots} />
            <BrowseMap data={data} />
            {children}
            <ProjectsBar projects={data.projects} />
        </div>
    )
}

export default MapLayout