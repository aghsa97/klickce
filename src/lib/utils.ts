import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractLongNameAddress(results: google.maps.GeocoderResult) {
  const { address_components, formatted_address } = results;
  for (const address of address_components) {
    if (
      address.types.includes("route") ||
      address.types.includes("political")
    ) {
      return address.long_name;
    }
  }
  return formatted_address;
}

export function NavigateToGoogleMaps(address: string) {
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${address}`,
    "_blank",
  );
}
