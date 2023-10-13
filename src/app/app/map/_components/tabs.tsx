'use client'

import { useEffect } from 'react'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import type { RouterOutputs } from '@/lib/api'
import { useMapStore } from '@/lib/store'

import ContentTab from './content-tab'
import MapFormNavbar from './navbar'
import ShareTab from './share-tab'
import MapCustomizeTabForm from '@/components/forms/map-form'


type FormTabsProps = {
    data: NonNullable<RouterOutputs["maps"]["getMapDataById"]>
    styles: string[]
}

function FormTabs({ styles, data }: FormTabsProps) {
    const { setMapData } = useMapStore()

    useEffect(() => {
        setMapData(data)
        return () => {
            setMapData(undefined)
        }
    }, [data, setMapData])

    return (
        <Tabs defaultValue="content" className='w-full h-full overflow-y-scroll'>
            <MapFormNavbar />
            <TabsContent value="content" className='h-full'>
                <ContentTab data={data} />
            </TabsContent>
            <TabsContent value='customize'>
                <MapCustomizeTabForm styles={styles} data={data} />
            </TabsContent>
            <TabsContent value='share'>
                <ShareTab />
            </TabsContent>
        </Tabs>
    )
}

export default FormTabs