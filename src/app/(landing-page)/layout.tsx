import type { ReactNode } from "react";

import MainHeader from "@/components/main-header";
import Logo from "@/components/ui/logo";

export default function LandingPageLayout(props: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col max-w-screen-md mx-auto">
            <nav className="fixed max-w-screen-md container z-50 flex h-16 items-center justify-between border-b backdrop-blur-[2px]">
                <div className="mr-8 hidden items-center md:flex">
                    <Logo size="lg" />
                </div>
                <MainHeader />
            </nav>
            <main className="flex-1">{props.children}</main>
        </div>
    );
}