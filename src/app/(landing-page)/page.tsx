import React from 'react'


import Hero from '@/components/landing-page/hero';
import Features from '@/components/landing-page/features';
import FAQs from '@/components/landing-page/faqs';
import OurMission from '@/components/landing-page/our-mission';
import PricingPlan from '@/components/landing-page/pricing-plan';
import TrustedBy from '@/components/landing-page/stats';

export const revalidate = 900;

async function Home() {
    return (
        <main className="flex w-full flex-col items-center justify-center py-24 px-4 md:px-0 gap-10">
            <Hero />
            {/* <TrustedBy /> */}
            <Features />
            <PricingPlan />
            <OurMission />
            <FAQs />
        </main >
    )
}

export default Home