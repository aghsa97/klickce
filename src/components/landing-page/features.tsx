import React from 'react'

import { cn } from '@/lib/utils';
import { marketingFeatures } from '@/app/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '../ui/button';
import * as Icon from '../icons';


function Features() {
    return (
        <div className='flex flex-col justify-center items-center gap-10 w-full border rounded-lg py-6'>
            <div className='flex flex-col items-center justify-center gap-2'>
                <Button variant={'outline'} size="icon" className='w-16 h-16 rounded-full'>
                    <Icon.Wand2 className='w-8 h-8' />
                </Button>
                <h2 className="text-xl md:text-3xl font-semibold text-center">
                    Why Choose Us
                </h2>
            </div>
            <div className='flex flex-col items-center'>
                <div className="grid grid-rows-4 grid-flow-row md:grid-flow-col gap-2">
                    {marketingFeatures.map((feature, index) => (
                        <Card key={index} className={cn("p-2 dark:bg-transparent shadow-none border-none")}>
                            <CardHeader>
                                {feature.icon}
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <CardTitle className='flex items-center justify-start'>
                                    {feature.title}
                                    {feature.badge && (
                                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {feature.badge}
                                        </span>
                                    )}
                                </CardTitle>
                                <CardDescription className="mt-2">
                                    {feature.body}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default Features