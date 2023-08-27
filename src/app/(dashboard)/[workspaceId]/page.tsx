import React from 'react'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

export const runtime = 'edge'

function DashboardPage() {

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
                <Link href={'#'} className={buttonVariants({ variant: 'default' })}>
                    Create new map
                </Link>
            </div>
            <ul className='grid grid-cols-2 gap-5'>
                {/* Map cards go here */}
            </ul>
        </div>
    )
}

export default DashboardPage