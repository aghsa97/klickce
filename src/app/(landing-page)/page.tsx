import React from 'react'
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { marketingFeatures } from '../config';
import { api } from '@/lib/trpc/api';
import Logo from '@/components/ui/logo';


async function Home() {
    const mapsCount = await api.maps.getMapsCount.query();
    const viewsCount = await api.maps.getViewsCount.query();
    const spotsCount = await api.spots.getSpotsCount.query();

    return (
        <main className="flex w-full flex-col items-center justify-center py-24 gap-24">
            <div className='w-full flex flex-col items-center rounded-lg border border-border p-6'>
                <h1 className="flex items-center justify-center gap-2 text-foreground font-semibold mb-6 text-3xl">
                    Welcome to <Logo size='3xl' />
                    <Badge variant={'secondary'}>beta</Badge>
                </h1>
                <p className="text-center text-muted-foreground text-lg mb-6">
                    Design personalized maps tailored to your interests or needs.
                    <br />
                    Add captivating content to each map spot - text, photos, and videos.
                </p>
                <div className='flex items-center justify-center gap-4 my-4'>
                    <Button variant={'outline'} asChild>
                        <Link href="/Sing-in">
                            Sign in
                        </Link>
                    </Button>
                    <Button variant={'ghost'} asChild>
                        <Link href="/Sing-up">
                            Create your first map
                        </Link>
                    </Button>
                </div>
            </div>
            <div className='flex justify-between items-center gap-8 w-full border border-border rounded-lg'>
                <Card className={cn("border-none dark:bg-transparent")}>
                    <CardHeader className='text-muted-foreground'>Maps</CardHeader>
                    <CardContent>
                        <CardTitle className='text-2xl'>{mapsCount.count}</CardTitle>
                    </CardContent>
                </Card>
                <Card className={cn("border-none dark:bg-transparent")}>
                    <CardHeader className='text-muted-foreground'>Views</CardHeader>
                    <CardContent>
                        <CardTitle>{viewsCount.count}</CardTitle>
                    </CardContent>
                </Card>
                <Card className={cn("border-none dark:bg-transparent")}>
                    <CardHeader className='text-muted-foreground'>Spots</CardHeader>
                    <CardContent>
                        <CardTitle>{spotsCount.count}</CardTitle>
                    </CardContent>
                </Card>
            </div>
            <div className='flex flex-col items-center gap-8'>
                <div>
                    <h2 className="text-2xl font-semibold text-center">
                        Features
                    </h2>
                    <p className="text-center text-muted-foreground">
                        Some of the features that we offer.
                    </p>
                </div>
                <div className='flex flex-col items-center'>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {marketingFeatures.map((feature) => (
                            <Card key={feature.title} className={cn("p-2 dark:bg-transparent")}>
                                <CardHeader>{feature.icon}</CardHeader>
                                <CardContent className="space-y-2">
                                    <CardTitle>{feature.title}</CardTitle>
                                    <CardDescription className="mt-2">
                                        {feature.body}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </main >
    )
}

export default Home