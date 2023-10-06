import { cn } from '@/lib/utils'
import React from 'react'

function Logo({ size = 'base' }: { size?: 'base' | 'sm' | 'lg' | '3xl' | '2xl' }) {
    return (
        <p className={cn("font-semibold",
            size === '3xl' && "text-3xl",
            size === '2xl' && "text-2xl",
            size === 'lg' && "text-lg",
            size === 'base' && "text-base",
            size === 'sm' && "text-sm",
        )}>Klick<span className="text-primary">ce</span></p>
    )
}

export default Logo