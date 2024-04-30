import MapCard from '@/components/map-card'
import { api } from '@/lib/trpc/api'
import CreateMapBtn from './_components/create-map-btn'


async function DashboardPage() {
    const maps = await api.maps.getCustomerMaps.query()

    if (!maps) return null
    return (
        <div className='w-full'>
            <div className='mb-6 flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold text-foreground'>
                        Dashboard
                    </h1>
                    <h2 className='text-muted-foreground'>
                        Overview of all maps in workspace
                    </h2>
                </div>
                <CreateMapBtn />
            </div>
            <ul className='grid gap-3'>
                {/* Map cards go here needs to be redesigned*/}
                {maps.map((map) => (
                    <MapCard
                        key={map.id}
                        id={map.id}
                        name={map.name}
                    />
                ))}
            </ul>
        </div>
    )
}

export default DashboardPage