import MapCustomizeTabForm from '@/components/forms/map-form'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import type { RouterOutputs } from '@/server/api'

import ContentTab from './content-tab'
import MapFormNavbar from './navbar'
import ShareTab from './share-tab'


type FormTabsProps = {
    data: NonNullable<RouterOutputs["maps"]["getMapDataById"]>
}

function FormTabs({ data }: FormTabsProps) {
    return (
        <Tabs defaultValue="content" className='w-full h-full overflow-y-auto'>
            <MapFormNavbar />
            <TabsContent value="content" className='h-full'>
                <ContentTab data={data} />
            </TabsContent>
            <TabsContent value='customize' className='h-full'>
                <MapCustomizeTabForm data={data} />
            </TabsContent>
            <TabsContent value='share' className='min-h-max'>
                <ShareTab />
            </TabsContent>
        </Tabs>
    )
}

export default FormTabs