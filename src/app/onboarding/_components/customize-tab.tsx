import MapCustomizeTabForm from '@/components/forms/map-form'
import { RouterOutputs } from '@/lib/api'

type ContentTabProps = {
    data: NonNullable<RouterOutputs["maps"]["getMapDataById"]>
}

function CustomizeTab({ data }: ContentTabProps) {
    return (
        <div className='flex flex-col'>
            <MapCustomizeTabForm data={data} />
        </div>
    )
}

export default CustomizeTab