'use client'

import type { MapRef } from "react-map-gl";

import { useState, useEffect, useRef } from 'react'
import { Map as ReactMap, Marker } from "react-map-gl";
import { useSearchParams } from "next/navigation";


import ImgPopover from "@/components/map/img-popover";
import useWindowSize from "@/hooks/use-window-size";
import * as Icon from "@/components/icons";
import { RouterOutputs } from '@/lib/api';
import { env } from "@/env";

import "mapbox-gl/dist/mapbox-gl.css";

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
                offset: isMobile ? [0, -100] : [500, 0],
                easing: (t) => t,
                duration: 500,
                zoom: zoom > 10 ? zoom : 10,
            })
        }
    }, [spotId, data, isMobile]);


    return (
        <ReactMap
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
            style={{
                width: "100%",
                height: "100vh",
                boxSizing: "border-box",
            }}
            maxPitch={60}
            maxZoom={20}
            mapStyle={`mapbox://styles/agha97/${data?.style ?? "clmuepcu300nu01qn7uen9v08"}`}
            {...viewport}
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
        </ReactMap>
    )
}

export default Map