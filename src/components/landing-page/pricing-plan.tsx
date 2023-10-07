'use client'

import React from 'react'

import { Button } from '../ui/button'
import * as Icon from '../icons';
import { PlanProps, plansConfig } from '@/app/config';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

function PricingPlan() {
    return (
        <div className='flex flex-col justify-center items-center gap-16 w-full border border-border rounded-lg p-6'>
            <div className='flex flex-col items-center justify-center gap-2'>
                <Button variant={'outline'} size="icon" className='w-16 h-16 rounded-full'>
                    <Icon.Coins className='w-8 h-8' />
                </Button>
                <h2 className="text-xl md:text-3xl font-semibold text-center">
                    Find your plan
                </h2>
            </div>
            <div className='w-full flex flex-wrap md:flex-nowrap md:items-center md:justify-between gap-4'>
                <Plan {...plansConfig.BASIC} />
                <Plan {...plansConfig.PRO} />
                <Plan {...plansConfig.ENTERPRISE} />
            </div>
        </div>)
}

export default PricingPlan

interface Props extends PlanProps {
    className?: string;
}

function Plan({
    title,
    description,
    cost,
    features,
    action,
    className,
    badge,
    disabled
}: Props) {
    return (
        <Card
            key={title}
            className={cn(
                "flex justify-between w-full h-[550px] flex-col border-transparent shadow-lg",
                className,
            )}
        >
            <div>
                <CardHeader>
                    <div className='flex items-center justify-start gap-2'>
                        <span className="font-cal text-3xl">{cost} SEK</span>
                        <span className="text-sm text-muted-foreground font-light">/month</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    <CardTitle className='flex items-center justify-start'>
                        {title}
                        {badge && (
                            <span className={cn("ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
                                title === 'Basic' && 'bg-yellow-100 text-yellow-800',
                            )}>
                                {badge}
                            </span>
                        )}
                    </CardTitle>
                    <CardDescription className="mt-2">
                        <span>{description}</span>
                    </CardDescription>
                    <ul className="border-border/50 grid divide-y py-2">
                        {features.map((item) => (
                            <li
                                key={item}
                                className="text-muted-foreground inline-flex items-center py-2 text-sm"
                            >
                                <Icon.Check className="mr-2 h-4 w-4 text-green-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </div>
            <CardFooter>
                {action ? (
                    <div>
                        {"link" in action ? (
                            <Button asChild={!disabled} disabled={disabled}>
                                {disabled ? "Contact us" : <Link href={action.link}>{action.text}</Link>}
                            </Button>
                        ) : null}
                    </div>
                ) : null}
            </CardFooter>
        </Card>
    );
}