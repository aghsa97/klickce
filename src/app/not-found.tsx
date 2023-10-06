import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {

    return (
        <main className="flex min-h-screen w-full flex-col space-y-6 p-4 md:p-8">
            {/* Redesign and redirect to dashboard? */}
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
                <div className="mx-auto max-w-xl text-center">
                    <div className="flex flex-col gap-4 p-12">
                        <h1>404</h1>
                        <p>Sorry, this page could not be found.</p>
                        <Button variant="link" asChild>
                            <Link href="/">Homepage</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}