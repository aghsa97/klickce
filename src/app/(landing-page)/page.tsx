import React from 'react'


import Hero from '@/components/landing-page/hero';
import Features from '@/components/landing-page/features';
import OurMission from '@/components/landing-page/our-mission';

async function Home() {

    return (
        <main className="flex w-full flex-col items-center justify-center py-12 xl:py-24 px-3 md:px-0">
            <Hero />
            <OurMission />
            <Features />
        </main >
    )
}

export default Home