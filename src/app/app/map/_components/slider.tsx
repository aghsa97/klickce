'use client'

import { useEffect, useState } from 'react'

import { useFormStore, useMapStore } from '@/lib/store'
import SpotForm from '@/components/forms/spot-form'
import * as Icon from '@/components/icons'

function Slider() {
    const { isFormOpen, id, setIsFormOpen } = useFormStore()
    const { mapData } = useMapStore()
    const [spot, setSpot] = useState<any>(null) // TODO: Fix types
    const [project, setProject] = useState<any>(null) // TODO: fix types

    useEffect(() => {
        const spot = mapData?.spots.find(spot => spot.id === id) ?? mapData?.projects.map(project => project.spots).flat().find(spot => spot.id === id)
        const project = mapData?.projects.find(project => project.id === spot?.projectId)
        setSpot(spot)
        setProject(project)
    }, [id, mapData, setIsFormOpen, isFormOpen])


    if (!isFormOpen || !mapData || !spot) return null
    return (
        <div>
            {isFormOpen && <div className='w-[500px] h-full p-4 flex flex-col border-r'>
                <Icon.Close className='absolute top-4 right-4 cursor-pointer' onClick={() => setIsFormOpen(false)} />
                <SpotForm key={spot.id} data={spot} projects={mapData.projects} project={project} mapId={mapData.id} />
            </div>}
        </div>
    )
}

export default Slider