'use client'

import { useEffect } from 'react'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import type { RouterOutputs } from '@/lib/api'
import { useMapStore } from '@/lib/store'

import CustomizeTab from './customize-tab'
import ContentTab from './content-tab'
import MapFormNavbar from './navbar'
import ShareTab from './share-tab'


type FormTabsProps = {
    mapId: string
    data: NonNullable<RouterOutputs["maps"]["getMapDataById"]>
    styles: string[]
}

function FormTabs({ styles, mapId, data }: FormTabsProps) {
    const { setMapData } = useMapStore()

    useEffect(() => {
        setMapData(data)
        return () => {
            setMapData(undefined)
        }
    }, [data, setMapData])

    return (
        <Tabs defaultValue="content" className='w-full h-full overflow-y-scroll'>
            <MapFormNavbar mapId={mapId} />
            <TabsContent value="content" className='h-full'>
                <ContentTab data={data} />
            </TabsContent>
            <TabsContent value='customize'>
                <CustomizeTab styles={styles} data={data} />
            </TabsContent>
            <TabsContent value='share'>
                <ShareTab mapId={mapId} />
            </TabsContent>
        </Tabs>
    )
}

export default FormTabs