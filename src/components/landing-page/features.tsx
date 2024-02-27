import React from 'react'

import { cn } from '@/lib/utils';
import { marketingFeatures } from '@/app/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '../ui/button';
import * as Icon from '../icons';
import { GridSmallBackground } from '../grid-small-background';


function Features() {
    return (
        <GridSmallBackground className='flex flex-col justify-center items-center gap-24 w-full py-24 xl:py-48'>
            <div className='flex flex-col items-center justify-center gap-2 md:px-48'>
                <Button variant={'outline'} size="icon" className='w-16 h-16 rounded-full'>
                    <Icon.Wand2 className='w-8 h-8' />
                </Button>
                <h2 className="text-xl md:text-3xl xl:text-5xl font-semibold tracking-tight text-center text-pretty">
                    Everything You Need to Create Engaging Maps
                </h2>
            </div>
            <div className='flex flex-col'>
                <div className="grid grid-rows-3 grid-flow-row md:grid-flow-col gap-3">
                    {marketingFeatures.map((feature, index) => (
                        <Card key={index} className={cn("p-2 bg-transparent rounded-2xl relative max-w-md backdrop-blur-[1px] bg-gradient-to-br from-zinc-200/50 from-0% to-50%")}>
                            <CardHeader>
                                {feature.icon}
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <CardTitle className='flex items-center justify-start'>
                                    {feature.title}
                                    {/* {feature.badge && (
                                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {feature.badge}
                                        </span>
                                    )} */}
                                </CardTitle>
                                <CardDescription className="mt-2">
                                    {feature.body}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </GridSmallBackground>

    )
}

export default Features