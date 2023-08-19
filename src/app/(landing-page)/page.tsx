import React from 'react'

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { marketingFeatures } from '../config';

export const runtime = "edge";

function Home() {
    return (
        <main className="flex w-full flex-col items-center justify-center py-24 gap-24">
            <div className='w-full flex flex-col items-center rounded-lg border border-border px-32 py-16'>
                <div>
                    <h1 className="text-3xl font-semibold text-center">
                        Welcome to <span>spottz</span> <Badge variant={'secondary'}>beta</Badge>
                    </h1>
                    <p className="text-center text-muted-foreground">
                        Create your own maps with custom markers and data.
                    </p>
                </div>
                <div className='flex items-center justify-center gap-4'>
                    <Button variant={'outline'} className="mt-8">Sign in</Button>
                    <Button variant={'ghost'} className="mt-8">Create your first map</Button>
                </div>
            </div>
            <div className='flex flex-col items-center gap-8'>
                <div>
                    <h2 className="text-2xl font-semibold text-center">
                        Features
                    </h2>
                    <p className="text-center text-muted-foreground">
                        Some of the features that spottz offers.
                    </p>
                </div>
                <div className='flex flex-col items-center'>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {marketingFeatures.map((feature) => (
                            <Card key={feature.title} className={cn("p-2")}>
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
        </main>
    )
}

export default Home