import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/trpc/api'

import { SettingsPlan } from './_components/plan'
import { CustomerPortalButton } from './_components/customer-portal-button'

async function Settings() {
    const data = await api.customers.getCustomerByClerkId.query()

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
                    <TabsContent value="billing" className="grid gap-8 pt-4">
                        <div className='flex items-center justify-between'>
                            <div className='flex flex-col items-start justify-center'>
                                <h3 className="text-lg leading-5 font-medium">Plans</h3>
                                <span className='flex items-center justify-center gap-1.5 text-muted-foreground text-sm'>
                                    <p>You are currently on the</p>
                                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{data?.subPlan || "13 days"}</Badge>
                                    <p>plan.</p>
                                </span>
                            </div>
                            <CustomerPortalButton />
                        </div>
                        <SettingsPlan customerData={data} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Settings