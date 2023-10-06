import type { ReactNode } from "react";

import MainHeader from "@/components/main-header";
import Logo from "@/components/ui/logo";
import AppFooter from "@/components/landing-page/landing-page-footer";

export default function LandingPageLayout(props: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col max-w-screen-md mx-auto">
            <nav className="w-full px-4 fixed max-w-screen-md z-50 flex h-16 items-center justify-between border-b backdrop-blur-[2px]">
                <div className="mr-8">
                    <Logo size="lg" />
                </div>
                <MainHeader />
            </nav>
            <main className="flex-1">{props.children}</main>
            <AppFooter />
        </div>
    );
}