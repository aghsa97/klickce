import React from 'react'
import { Leckerli_One } from 'next/font/google'

import { cn } from '@/lib/utils'

const font = Leckerli_One({ subsets: ['latin'], weight: ['400'] })

type Props = {
    className?: string
}

function Logo({ className }: Props) {
    return (
        <div className={cn("text-2xl text-foreground", className)} style={font.style}>Klickce</div>
    )
}

export default Logo