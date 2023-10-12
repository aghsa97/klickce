import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import * as Icon from '@/components/icons'
import { plansConfig } from '@/app/config'
import { api } from '@/lib/trpc/api'

import { SettingsPlan } from './_components/plan'
import { CustomerPortalButton } from './_components/customer-portal-button'

async function Settings() {
    const data = await api.customers.getCustomerByClerkId.query()

    const calculateDateThatSubscriptionEnds = (endsAt: Date) => {
        // returns in the format of DD MMM YYYY ex. 12 Jan 2021
        const date = new Date(endsAt)
        const day = date.getDate()
        const month = date.toLocaleString('default', { month: 'short' })
        const year = date.getFullYear()
        return `${day} ${month} ${year}`
    }

    return (
        <div className='w-full'>
            <div className='mb-6 flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-semibold text-foreground'>
                        Settings
                    </h1>
                    <h2 className='text-muted-foreground'>
                        Your account settings
                    </h2>
                </div>
            </div>
            <div className="col-span-full">
                <Tabs defaultValue="billing" className="relative mr-auto w-full">
                    <TabsList className="h-9 w-full justify-start rounded-none border-b bg-transparent p-0">
                        <TabsTrigger
                            className="text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold shadow-none transition-none data-[state=active]:shadow-none"
                            value="billing"
                        >
                            Billing
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="billing" className="grid gap-4 pt-2">
                        <div className='flex items-center justify-between'>
                            <div className='flex flex-col items-start justify-center'>
                                <h3 className="text-lg leading-5 font-medium">Plans</h3>
                                <span className='flex items-center justify-center gap-1.5 text-muted-foreground text-sm'>
                                    <span className='flex items-center justify-center gap-1.5 text-muted-foreground text-sm'>
                                        <p>You are currently on the</p>
                                        {data.subPlan ?
                                            <>
                                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{data.subPlan}</Badge>
                                                <p>plan.</p>
                                            </>
                                            :
                                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">No plan</Badge>
                                        }
                                    </span>
                                </span>
                            </div>
                            <CustomerPortalButton />
                        </div>
                        {data.subPlan && data.endsAt && <Alert variant='default' className='mt-4'>
                            <Icon.Coins className='w-4 h-4' />
                            <AlertTitle>
                                {!data.onTrial ? "Billing information" : `Your trial ends on ${calculateDateThatSubscriptionEnds(data.endsAt)}`}
                            </AlertTitle>
                            <AlertDescription>
                                {!data.onTrial ?
                                    ` You will be charged SEK ${plansConfig[data.subPlan].cost}.00 on ${calculateDateThatSubscriptionEnds(data.endsAt)}.`
                                    :
                                    ` Consider updating your payment information to continue using our services.`}
                            </AlertDescription>
                        </Alert>}
                        {!data.subPlan && <Alert variant='default' className='mt-4'>
                            <Icon.Wand2 className='w-4 h-4' />
                            <AlertTitle>
                                It seems your subscription has come to an end.
                            </AlertTitle>
                            <AlertDescription>
                                To access all the fantastic features and tools we offer, kindly consider subscribing.
                            </AlertDescription>
                        </Alert>}

                        <SettingsPlan customerData={data} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Settings