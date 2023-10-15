'use client'

import type { MapRef } from "react-map-gl";

import { useState, useEffect, useRef, useCallback } from 'react'
import { Map as ReactMap, Marker } from "react-map-gl";
import { useSearchParams } from "next/navigation";


import ImgPopover from "@/components/map/img-popover";
import useWindowSize from "@/hooks/use-window-size";
import * as Icon from "@/components/icons";
import { RouterOutputs } from '@/lib/api';
import { env } from "@/env";

import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import mapboxgl from "mapbox-gl";

type DataProps = NonNullable<RouterOutputs["maps"]["getMapById"]>

type MapProps = {
    data: DataProps
}

function Map({ data }: MapProps) {

    const mapRef = useRef<MapRef>(null);
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

    useEffect(() => {
        if (data.isUserCurrentLocationVisible) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
            });
        }
    }, [data]);

    useEffect(() => {
        if (mapRef.current && spotId) {
            const spot = data.spots.find((spot) => spot.id === spotId) ?? data.projects.flatMap((project) => project.spots).find((spot) => spot.id === spotId)
            const zoom = mapRef.current.getMap().getZoom()
            if (!spot) return
            mapRef.current?.easeTo({
                center: [spot.lng, spot.lat],
                offset: isMobile ? [-100, -100] : [600, 0],
                easing: (t) => t,
                duration: 500,
                zoom: zoom > 10 ? zoom : 10,
            })
        }
    }, [spotId, data, isMobile]);

    useEffect(() => {
        if (window) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        }
    }, []);

    const onMapLoad = useCallback(() => {
        // check of mapdata spots in projects and mapdata spots is empty
        if (data.spots.length === 0 && data.projects.flatMap((project) => project.spots).length === 0) return
        const bounds = new mapboxgl.LngLatBounds();
        data.spots.forEach((spot) => {
            bounds.extend([spot.lng, spot.lat]);
        });
        data.projects.forEach((project) => {
            project.spots.forEach((spot) => {
                bounds.extend([spot.lng, spot.lat]);
            });
        });
        mapRef.current?.fitBounds(bounds, {
            padding: 200,
            duration: 0,
        });
    }, [data])

    return (
        <ReactMap
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
            style={{
                width: "100%",
                height: "calc(var(--vh, 1vh) * 100)",
                boxSizing: "border-box",
            }}
            maxPitch={60}
            maxZoom={20}
            mapStyle={`mapbox://styles/${env.NEXT_PUBLIC_MAPBOX_USERNAME}/${data.style}`}
            {...viewport}
            onLoad={onMapLoad}
            onMove={(viewport) => setViewport(viewport.viewState)}
            ref={mapRef}
        >
            {!projectId && <ImgPopover data={data.spots} />}
            {projectId && data?.projects.map((project) => {
                if (project.id !== projectId) return null
                return <ImgPopover key={project.id} data={project.spots} projectColor={project.color} />
            })
            }
            {!projectId && data?.projects.map((project) => <ImgPopover key={project.id} data={project.spots} projectColor={project.color} />)}
            {userLocation && <Marker
                latitude={userLocation[0]}
                longitude={userLocation[1]}
            >
                <Icon.PersonStanding className='w-10 h-10 animate-pulse text-blue-500' strokeWidth={3} />
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