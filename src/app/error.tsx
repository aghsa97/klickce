'use client'

import React from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function Error({ error }: { error: Error, reset: () => void }) {
    return (
        <main className="grid h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
            {/* Redesign page? */}
            <div className="text-center">
                <p className="text-base font-semibold text-primary">Looks like you got lost</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Oops... Page not found</h1>
                <p className="mt-6 text-base leading-7 text-muted-foreground">Sorry, {error.message}</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link href="/dashboard" className={cn(buttonVariants({ variant: 'default' }))}>Go back home</Link>
                </div>
            </div>
        </main>
    )
}

export default Error