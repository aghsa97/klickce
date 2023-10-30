'use client'

import type { MapRef } from "react-map-gl";

import { useState, useEffect, useRef, useCallback, useTransition } from 'react'
import { Map as ReactMap, Marker, MarkerDragEvent } from "react-map-gl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getGeocode } from 'use-places-autocomplete';
import mapboxgl from "mapbox-gl";
import Link from "next/link";

import ProjectsBar from "@/components/map/projects-bar";
import { api, RouterOutputs } from '@/lib/trpc/client';
import ImgPopover from "@/components/map/img-popover";
import { extractLongNameAddress } from '@/lib/utils';
import useWindowSize from "@/hooks/use-window-size";
import MapMenu from "@/components/map/map-menu";
import * as Icon from "@/components/icons";
import { useMapStore } from '@/config/store';
import Logo from "@/components/ui/logo";
import { env } from "@/env";

import "mapbox-gl/dist/mapbox-gl.css";
import { toast } from "sonner";

type MapProps = {
    data: NonNullable<RouterOutputs["maps"]["getMapDataById"]>
};

function Map({ data: mapData }: MapProps) {
    const router = useRouter()
    const { mapId } = useParams()
    const mapRef = useRef<MapRef>(null);

    const [isPending, startTransition] = useTransition()
    const { setStoreMapZoom, isMovePin, setIsMovePin } = useMapStore()

    const { isMobile } = useWindowSize()

    const searchParams = useSearchParams()
    const spotId = searchParams.get('spotId')
    const projectId = searchParams.get('projectId')

    const [viewport, setViewport] = useState({
        latitude: 58.4023656,
        longitude: 13.8850186,
        zoom: 8,
    });

    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [selectedAddress, setSelectedAddress] = useState({
        latitude: viewport.latitude,
        longitude: viewport.longitude,
        address: '',
    });

    useEffect(() => {
        if (mapData?.isUserCurrentLocationVisible) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
            });
        }
    }, [mapData]);

    useEffect(() => {
        if (mapRef.current && spotId && mapData) {
            const spot = mapData.spots.find((spot) => spot.id === spotId) ?? mapData.projects.flatMap((project) => project.spots).find((spot) => spot.id === spotId)
            const zoom = mapRef.current.getMap().getZoom()
            if (!spot) return
            mapRef.current?.easeTo({
                center: [spot.lng, spot.lat],
                offset: isMobile ? [0, -100] : [200, 0],
                easing: (t) => t,
                duration: 500,
                zoom: zoom > 10 ? zoom : 10,
            })
        }
    }, [spotId, mapData, isMobile]);

    const onMarkerDragEnd = useCallback(async (event: MarkerDragEvent) => {
        const result = await getGeocode({ location: { lat: event.lngLat.lat, lng: event.lngLat.lng, } })
        setSelectedAddress({
            latitude: event.lngLat.lat,
            longitude: event.lngLat.lng,
            address: result[0].formatted_address,
        });
        startTransition(async () => {
            try {
                if (!event.lngLat.lat || !event.lngLat.lng || !result) return // TODO: handle error
                await api.spots.createSpot.mutate({
                    mapId: mapId as string,
                    address: result[0].formatted_address,
                    name: extractLongNameAddress(result[0]),
                    lat: event.lngLat.lat,
                    lng: event.lngLat.lng,
                })
                router.refresh()
                toast.success(`Spot created with name ${extractLongNameAddress(result[0])}`)
            } catch (error: any) {
                console.log(error); // TODO: handle error
                toast.error(error.message)
            }
        })
    }, [mapId, router]);

    const onMapMoveEnd = useCallback(() => {
        if (mapRef.current) {
            const { lat, lng } = mapRef.current.getMap().getCenter();
            const zoom = mapRef.current.getMap().getZoom();
            setStoreMapZoom(zoom)
            setSelectedAddress({
                latitude: lat,
                longitude: lng,
                address: '',
            });

            if (zoom < 12) {
                setIsMovePin(false)
            }
        }
    }, [setStoreMapZoom, setIsMovePin]);



    const onMapLoad = useCallback(() => {
        // check of mapdata spots in projects and mapdata spots is empty
        if (mapData?.spots.length === 0 && mapData?.projects.flatMap((project) => project.spots).length === 0) return
        const bounds = new mapboxgl.LngLatBounds();
        mapData?.spots.forEach((spot) => {
            bounds.extend([spot.lng, spot.lat]);
        });
        mapData?.projects.forEach((project) => {
            project.spots.forEach((spot) => {
                bounds.extend([spot.lng, spot.lat]);
            });
        });
        mapRef.current?.fitBounds(bounds, {
            padding: 200,
            duration: 0,
        });
    }, [mapData])

    if (!mapData) return null
    return (
        <ReactMap
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
            style={{
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                zIndex: 10,
            }}
            maxPitch={60}
            maxZoom={20}
            ref={mapRef}
            {...viewport}
            onLoad={onMapLoad}
            onMoveEnd={onMapMoveEnd}
            onMove={(viewport) => setViewport(viewport.viewState)}
            mapStyle={`mapbox://styles/${env.NEXT_PUBLIC_MAPBOX_USERNAME}/${mapData.style}`}
        >
            <MapMenu name={mapData.name} projects={mapData.projects} spots={mapData.spots} />
            <ProjectsBar projects={mapData.projects} />
            {!projectId &&
                mapData.projects.map((project) => project.isVisible && <ImgPopover key={project.id} data={project.spots} projectColor={project.color} />)}
            {!projectId &&
                <ImgPopover data={mapData.spots} />}
            {projectId && mapData.projects.map((project) => {
                if (project.id !== projectId || !project.isVisible) return null
                return <ImgPopover key={project.id} data={project.spots} projectColor={project.color} />
            })
            }
            {userLocation && <Marker
                latitude={userLocation[0]}
                longitude={userLocation[1]}
            >
                <Icon.PersonStanding className='w-10 h-10 animate-pulse text-blue-500' strokeWidth={3} />
            </Marker>
            }
            {isMovePin && <Marker
                longitude={selectedAddress.longitude}
                latitude={selectedAddress.latitude}
                anchor="bottom"
                draggable={!isPending}
                onDragEnd={onMarkerDragEnd}
            >
                <Icon.MapPin className='w-8 h-8 fill-primary text-primary-foreground' />
            </Marker>}
            <div className="absolute text-xs italic w-max bottom-1 right-4 md:left-1/2 md:right-1/2 text-white bg-black/50 backdrop-blur-[2px] rounded-full px-3 py-1.5 gap-1.5 flex items-center justify-center">
                <p>Powered By</p>
                <Link href={'https://www.klickce.se/'} target="_blank">
                    <Logo size="xs" />
                </Link>
            </div>
        </ReactMap>
    )
}

export default Map