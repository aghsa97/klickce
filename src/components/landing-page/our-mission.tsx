import React from 'react'

import { Button } from '../ui/button'
import * as Icon from '../icons';
import { aboutUs } from '@/app/config';

function OurMission() {
    return (
        <div className='flex flex-col justify-center items-center gap-10 w-full border border-border rounded-lg px-6 py-6'>
            <div className='flex flex-col items-center justify-center gap-2'>
                <Button variant={'outline'} size="icon" className='w-16 h-16 rounded-full'>
                    <Icon.FingerPrint className='w-8 h-8' />
                </Button>
                <h2 className="text-xl md:text-3xl font-semibold text-center">
                    Our mission
                </h2>
            </div>
            <div className='w-full flex items-center justify-center text-center text-base'>
                {aboutUs.body}
            </div>
        </div>
    )
}

export default OurMission