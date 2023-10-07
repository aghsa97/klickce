import React from 'react'

import { Button } from '../ui/button'
import * as Icon from '../icons';

type StatsCardProps = {
    title: string;
    value: number;
}

function Stats({ mapsCount, spotsCount, viewsCount }: { mapsCount: number, spotsCount: number, viewsCount: number }) {
    return (
        <div className='flex flex-col justify-center items-center gap-16 w-full border border-border rounded-lg px-4 md:px-20 py-6'>
            <div className='flex flex-col items-center justify-center gap-2'>
                <Button variant={'outline'} size="icon" className='w-16 h-16 rounded-full'>
                    <Icon.Rocket className='w-8 h-8' />
                </Button>
                <h2 className="text-xl md:text-3xl font-semibold text-center">
                    We are growing
                </h2>
            </div>
            <div className='w-full flex items-center justify-between'>
                <StatsCard title='Maps to explore' value={mapsCount} />
                <StatsCard title='Spots to discover' value={spotsCount} />
                <StatsCard title='Views and counting' value={viewsCount} />
            </div>
        </div>
    )
}

export default Stats

function StatsCard({ title, value }: StatsCardProps) {
    return (
        <div className='flex flex-col items-center justify-center text-center'>
            <h1 className="text-xl md:text-3xl font-semibold text-center">
                {value}
            </h1>
            <p className="text-xs md:text-base font-light text-muted-foreground">
                {title}
            </p>
        </div>
    )
}