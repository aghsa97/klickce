import { cn } from '@/lib/utils'
import React from 'react'

function Logo({ size = 'base', className }: { size?: 'base' | 'sm' | 'lg' | '3xl' | '2xl' | 'xs' | '10px', className?: string }) {
    return (
        <p className={cn("font-semibold",
            size === '3xl' && "text-3xl",
            size === '2xl' && "text-2xl",
            size === 'lg' && "text-lg",
            size === 'base' && "text-base",
            size === 'sm' && "text-sm",
            size === 'xs' && "text-xs",
            size === '10px' && "text-[10px]",
            className
        )}>Klick<span className="text-primary">ce</span></p>
    )
}

export default Logo