import { notFound } from "next/navigation";

import AppHeader from "@/components/layouts/app-header";
import { api } from "@/lib/trpc/api";

import FormSearch from "../_components/search";
import FormTabs from "../_components/tabs";
import Map from "../_components/edit-map";

export default async function OnboardingLayout(props: { children: React.ReactNode, modal: React.ReactNode, params: { mapId: string } }) {
    const mapdata = await api.maps.getMapDataById.query({ id: props.params.mapId })

    return (
        <div className="w-full min-h-screen overflow-hidden">
            <AppHeader className="px-4" />
            <main className="w-full max-h-[calc(100vh-4rem)] flex flex-1">
                <aside className='flex relative'>
                    <div className='w-96 min-h-[calc(100vh-4rem)]  px-2 py-4 flex flex-col border-r'>
                        <FormSearch />
                        <FormTabs data={mapdata} />
                    </div>
                    {props.children}
                </aside>
                <div className='w-full relative m-4 border border-border bg-muted rounded-lg flex flex-col'>
                    <div className='px-4 py-3 flex items-center justify-start gap-2'>
                        <div className='h-3 w-3 rounded-full bg-red-400'></div>
                        <div className='h-3 w-3 rounded-full bg-yellow-400'></div>
                        <div className='h-3 w-3 rounded-full bg-green-400'></div>
                    </div>
                    {props.modal}
                    <Map mapdata={mapdata} />
                </div>
            </main>
        </div>
    );
}