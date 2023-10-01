'use client'

import { useGoogleMapsScript } from "use-google-maps-script";
import type { Libraries } from "use-google-maps-script";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

import * as Icon from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Command, CommandGroup, CommandItem, } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { extractLongNameAddress } from "@/lib/utils";

interface ISearchBoxProps {
    onSelectAddress: (
        location: {
            address: string;
            locationName: string;
        },
        latitude: number | null,
        longitude: number | null
    ) => void;
    defaultValue: string;
    className?: string;
}

interface IReadySearchBoxProps {
    onSelectAddress: (
        location: {
            address: string;
            locationName: string;
        },
        latitude: number | null,
        longitude: number | null
    ) => void;
    defaultValues: string;
}

const libraries: Libraries = ["places"];

export default function SearchBox({ onSelectAddress, defaultValue }: ISearchBoxProps) {
    const { isLoaded, loadError } = useGoogleMapsScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries,
        region: "SE",
    })

    if (!isLoaded) return <Skeleton className="w-full h-10" />; // loading
    if (loadError) return <p>Erros loading</p>; // error
    return (
        <ReadySearchBox
            onSelectAddress={onSelectAddress}
            defaultValues={defaultValue}
        />
    );
}

function ReadySearchBox({ onSelectAddress, defaultValues }: IReadySearchBoxProps) {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({ debounce: 300, defaultValue: defaultValues });

    const handleChange = (e: { target: { value: string; }; }) => {
        setValue(e.target.value);
        if (e.target.value === "") {
            onSelectAddress({ address: "", locationName: "" }, null, null);
        }
    };

    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = getLatLng(results[0]);
            const locationName = extractLongNameAddress(results[0]);
            onSelectAddress({ address, locationName }, lat, lng);
            setValue("")
        } catch (error) {
            console.error(`😱 Error:`, error);
        }
    };

    return (
        <Command className="">
            <Input
                id="search"
                value={value}
                onChange={handleChange}
                disabled={!ready}
                placeholder="Search for a place or drop the pin"
                autoComplete="off"
            />
            {status === "OK" &&
                <CommandGroup className="rounded-lg shadow-md absolute z-50 bg-muted top-16" >
                    {data.map((data) => (
                        <CommandItem key={data.place_id} className="text-foreground" onSelect={() => handleSelect(data.description)}>
                            <Icon.MapPin className="w-5 h-5 mr-2" />
                            {data.description}
                        </CommandItem>
                    ))}
                </CommandGroup>
            }
        </Command>
    );
}
