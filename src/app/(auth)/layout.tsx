import Link from "next/link";
import * as React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import * as Icons from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = auth();

    if (userId) {
        redirect("/app");
    }
    return (
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            <aside className="border-border col-span-1 flex w-full items-center justify-center border-r p-3 backdrop-blur-[2px] md:p-6">
                <div className="w-full max-w-lg text-left">
                    <h1 className="text-foreground mb-3 text-2xl font-semibold">
                        Start your mapping journey with us.
                    </h1>
                    <p className="text-muted-foreground">
                        Create personalized maps with Spottz powerful platform.
                        <br />
                        Your own maps your own spots.
                    </p>
                    <Link href="/" className={cn(buttonVariants({ variant: 'outline' }), 'group mt-6')}>
                        Explore our features
                        <Icons.ChevronRight className="ml-2 w-5 group-hover:translate-x-1 group-hover:animate-in" />
                    </Link>
                    <div className="h-12" />
                </div>
            </aside>
            <main className="container col-span-1 mx-auto flex items-center justify-center md:col-span-1 xl:col-span-2">
                {children}
            </main>
        </div>
    );
}