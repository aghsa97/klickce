'use client'

import type { MapRef } from "react-map-gl";

import { useState, useEffect, useRef, useCallback, useTransition } from 'react'
import { Map as ReactMap, Marker, MarkerDragEvent } from "react-map-gl";
import { getGeocode } from 'use-places-autocomplete';
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { cn, extractLongNameAddress } from '@/lib/utils';
import * as Icon from "@/components/icons";
import { useMapStore } from '@/lib/store';
import { api, RouterOutputs } from '@/lib/trpc/client';

import "mapbox-gl/dist/mapbox-gl.css";
import { useToastAction } from "@/hooks/use-toast-action";
import { env } from "@/env";
import MapMenu from "./map/map-menu";
import ProjectsBar from "./map/projects-bar";
import ImgPopover from "./map/img-popover";
import useWindowSize from "@/hooks/use-window-size";

type data = NonNullable<RouterOutputs["maps"]["getMapById"]>

function Map() {
    const router = useRouter()
    const mapRef = useRef<MapRef>(null);
    const { mapId } = useParams()
    const { toast } = useToastAction()

    const [isPending, startTransition] = useTransition()
    const { setStoreMapZoom, isMovePin, setIsMovePin, mapData } = useMapStore()

    const { isMobile } = useWindowSize()

    const searchParams = useSearchParams()
    const spotId = searchParams.get('spotId')
    const projectId = searchParams.get('projectId')


    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [viewport, setViewport] = useState({
        latitude: 58.4023656,
        longitude: 13.8850186,
        zoom: 8,
    });
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
                offset: isMobile ? [0, -100] : [500, 0],
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
                toast('created', `Spot created with name ${extractLongNameAddress(result[0])}`)
            } catch (error: any) {
                console.log(error); // TODO: handle error
                toast('error', error.message)
            }
        })
    }, [mapId, router, toast]);

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

    if (!mapData) return null
    return (
        <ReactMap
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
            style={{
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
            }}
            maxPitch={60}
            maxZoom={20}
            mapStyle={`mapbox://styles/${env.NEXT_PUBLIC_MAPBOX_USERNAME}/${mapData.style}`}
            {...viewport}
            onMove={(viewport) => setViewport(viewport.viewState)}
            ref={mapRef}
            onMoveEnd={onMapMoveEnd}
        >
            <MapMenu name={mapData.name} projects={mapData.projects} spots={mapData.spots} />
            {!projectId && <ImgPopover data={mapData.spots} />}
            {projectId && mapData.projects.map((project) => {
                if (project.id !== projectId) return null
                return <ImgPopover key={project.id} data={project.spots} projectColor={project.color} />
            })
            }
            {!projectId && mapData.projects.map((project) => <ImgPopover key={project.id} data={project.spots} projectColor={project.color} />)}
            <ProjectsBar projects={mapData.projects} />
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
        </ReactMap>
    )
}

export default Map