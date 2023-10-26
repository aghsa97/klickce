import React from 'react'

import { Button } from '../ui/button'
import * as Icon from '../icons';

function TrustedBy() {
    return (
        <div className='flex flex-col justify-center items-center gap-12 w-full border border-border rounded-lg px-4 md:px-20 py-6'>
            <div className='flex flex-col items-center justify-center gap-2'>
                <Button variant={'outline'} size="icon" className='w-16 h-16 rounded-full'>
                    <Icon.Check className='w-8 h-8' />
                </Button>
                <h2 className="text-xl md:text-3xl font-semibold text-center">
                    Trusted by
                </h2>
            </div>
            <div className='w-full flex items-center justify-between'>

            </div>
        </div>
    )
}

export default TrustedBy