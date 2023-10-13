import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function Loading() {
    return (
        <div className='w-full px-2 py-4 flex flex-col'>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full mt-2' />
            <Skeleton className='h-96 w-full mt-2' />
        </div>
    )
}

export default Loading