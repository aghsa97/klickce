'use client'

import { RouterOutputs } from '@/lib/trpc/client'
import { useFormStore } from '@/lib/store';

// TODO: fix types
type data = NonNullable<RouterOutputs["maps"]["getMapDataById"]>
type SpotPopoverProps = {
    data: data["spots"][0]
    project?: data["projects"][0]
    padding?: 'p-1' | 'p-2'
}

function SpotPopover({ data, project, padding = 'p-1' }: SpotPopoverProps) {
    const { setIsFormOpen, isFormOpen, id, setId } = useFormStore()
    function handleOpenSlider() {
        if (isFormOpen && id === data.id) return setIsFormOpen(false)
        setId(data.id)
        setIsFormOpen(true)
    }

    return (
        <div className='w-full flex items-center justify-between cursor-pointer' onClick={handleOpenSlider}>
            <div className={`w-full hover:bg-secondary ${padding} rounded-lg`}>
                <li className='w-full flex items-center justify-start gap-2 item'>
                    <span className='h-5 min-w-[20px] rounded-full border-2 border-white' style={{
                        backgroundColor: project?.color ?? data.color
                    }} />
                    <div className="flex flex-col items-start justify-start text-start">
                        <h1 className="text-sm line-clamp-1">{data.name}</h1>
                        <h4 className='text-xs text-muted-foreground line-clamp-1'>{data.address}</h4>
                    </div>
                </li>
            </div>
        </div>
    )
}

export default SpotPopover