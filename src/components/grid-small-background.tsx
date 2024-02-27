import { cn } from "@/lib/utils";
import React from "react";

export function GridSmallBackground({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.3] relative", className)}>
            {/* Radial gradient for the container to give a faded look */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-background bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)] md:[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            {children}
        </div>
    );
}
