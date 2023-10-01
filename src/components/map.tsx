'use client'

import type { MapRef } from "react-map-gl";

import { useState, useEffect, useRef, useCallback, useTransition } from 'react'
import { Map as ReactMap, Marker, MarkerDragEvent } from "react-map-gl";
import { getGeocode } from 'use-places-autocomplete';
import { useParams, useRouter } from "next/navigation";

import { cn, extractLongNameAddress } from '@/lib/utils';
import * as Icon from "@/components/icons";
import { useMapStore } from '@/lib/store';
import { api } from '@/lib/trpc/client';

import "mapbox-gl/dist/mapbox-gl.css";
import { useToastAction } from "@/hooks/use-toast-action";

function Map() {
    const router = useRouter()
    const mapRef = useRef<MapRef>(null);
    const { mapId } = useParams()
    const { toast } = useToastAction()

    const [isPending, startTransition] = useTransition()
    const { setStoreMapZoom, isMovePin, setIsMovePin, mapData } = useMapStore()

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
                toast('created')
            } catch (error) {
                console.log(error); // TODO: handle error
                toast('error')
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

    return (
        <ReactMap
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
            style={{
                width: "100%",
                height: "100%",
            }}
            maxPitch={60}
            maxZoom={20}
            mapStyle={`mapbox://styles/agha97/${mapData?.style ?? "cl9y2s7es00ce14qtff13sdhn"}`}
            {...viewport}
            onMove={(viewport) => setViewport(viewport.viewState)}
            ref={mapRef}
            onMoveEnd={onMapMoveEnd}
        >
            {mapData?.spots.map((spot) => (
                <Marker
                    key={spot.id}
                    latitude={spot.lat}
                    longitude={spot.lng}
                >
                    <div className='w-4 h-4 bg-yellow-500 border-2 rounded-full'
                        style={{ backgroundColor: spot.color }}
                    />
                </Marker>
            ))}
            {mapData?.projects.map((project) => (
                project.isVisible && project.spots.map((spot) => {
                    const projectColor = project.color ?? "bg-yellow-500"
                    return <Marker
                        key={spot.id}
                        latitude={spot.lat}
                        longitude={spot.lng}
                    >
                        <div className={cn('w-4 h-4 border-2 rounded-full', projectColor)}
                            style={{ backgroundColor: project.color }}
                        />
                    </Marker>
                })
            ))}
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