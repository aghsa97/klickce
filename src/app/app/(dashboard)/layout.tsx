import AppHeader from "@/components/layouts/app-header";

async function DashboardLayout(props: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen overflow-hidden rounded-[0.5rem] max-w-screen-md mx-auto"
        >
            <AppHeader />
            <main className="min-h-[calc(100vh-4rem)] flex flex-1 space-y-4 p-4 md:px-0 pt-6">
                {props.children}
            </main>
        </div>
    );
}

export default DashboardLayout;