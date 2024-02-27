import React from 'react'

import { aboutUs } from '@/app/config';

function OurMission() {
    return (
        <div className='flex flex-col 2xl:flex-row justify-center items-start gap-12 2xl:gap-24 text-zinc-950 w-full px-12 py-24 my-24 backdrop-blur-[1pxs] border rounded-2xl bg-gradient-to-br from-zinc-200/50 from-0% to-50%'>
            <h2 className="text-3xl font-semibold tracking-tight shrink-0">
                Our mission
            </h2>
            <div className='w-full text-pretty text-[22px] leading-normal'>
                {aboutUs.body}
            </div>
        </div>
    )
}

export default OurMission