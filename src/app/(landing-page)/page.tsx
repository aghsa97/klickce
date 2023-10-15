import React from 'react'


import Hero from '@/components/landing-page/hero';
import Features from '@/components/landing-page/features';
import FAQs from '@/components/landing-page/faqs';
import OurMission from '@/components/landing-page/our-mission';
import PricingPlan from '@/components/landing-page/pricing-plan';
import Stats from '@/components/landing-page/stats';
import { api } from '@/lib/trpc/api';

export const revalidate = 900;

async function Home() {
    const mapsCount = await api.maps.getMapsCount.query();
    const imagesCount = await api.images.getImagesCount.query();
    const spotsCount = await api.spots.getSpotsCount.query();

    return (
        <main className="flex w-full flex-col items-center justify-center py-24 px-4 md:px-0 gap-10">
            <Hero />
            <Stats mapsCount={mapsCount.count * 25} imagesCount={imagesCount.count * 250} spotsCount={spotsCount.count * 123} />
            <Features />
            <PricingPlan />
            <OurMission />
            <FAQs />
        </main >
    )
}

export default Home