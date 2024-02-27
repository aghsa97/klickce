import type { ReactNode } from "react";

import Header from "@/components/landing-page/header";
import Logo from "@/components/ui/logo";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";

export default function LandingPageLayout(props: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col max-w-screen-xl mx-auto px-3 xl:px-0">
            <nav className="w-full flex py-3 items-center justify-between">
                <Logo className="text-3xl" />
                <Header />
            </nav>
            <main className="flex-1">{props.children}</main>
            <LandingPageFooter />
        </div>
    );
}