import Map from "@/components/map";
import AppHeader from "@/components/layouts/app-header";




export default async function MapLayout(props: { children: React.ReactNode }) {
    return (
        <div className="w-full min-h-screen overflow-hidden">
            <AppHeader className="px-4" />
            <main className="min-h-[calc(100vh-4rem)] flex flex-1">
                <div className='w-full flex'>
                    <aside className='flex h-full relative'>
                        <div className='w-full'>
                            {props.children}
                        </div>
                    </aside>
                    <div className='w-full m-4 border border-border bg-muted rounded-lg flex flex-col'>
                        <div className='px-4 py-3 flex items-center justify-start gap-2'>
                            <div className='h-3 w-3 rounded-full bg-red-400'></div>
                            <div className='h-3 w-3 rounded-full bg-yellow-400'></div>
                            <div className='h-3 w-3 rounded-full bg-green-400'></div>
                        </div>
                        <Map />
                    </div>
                </div>
            </main>
        </div>
    );
}