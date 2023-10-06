import MapCustomizeTabForm from '@/components/forms/map-form'
import { RouterOutputs } from '@/lib/api'

type ContentTabProps = {
    data: NonNullable<RouterOutputs["maps"]["getMapDataById"]>
    styles: string[]
}

function CustomizeTab({ styles, data }: ContentTabProps) {

    return (
        <div className='flex flex-col'>
            <MapCustomizeTabForm styles={styles} data={data} />
        </div>
    )
}

export default CustomizeTab