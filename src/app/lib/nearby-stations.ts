import { Loader } from "@googlemaps/js-api-loader";
import { StationSummary } from "./stations";

type Point = { lat: number; lng: number };

function distanceKm(first: Point, second: Point) {
  const radians = (value: number) => value * Math.PI / 180;
  const lat = radians(second.lat - first.lat);
  const lng = radians(second.lng - first.lng);
  const value = Math.sin(lat / 2) ** 2 + Math.cos(radians(first.lat)) * Math.cos(radians(second.lat)) * Math.sin(lng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(value));
}

function comparableName(value: string) {
  return value.toLowerCase().replace(/\b(service|filling|fuel|gas|petrol|station)\b/g, "").replace(/[^a-z0-9]/g, "");
}

function isDuplicate(verified: StationSummary, candidate: StationSummary) {
  const verifiedName = comparableName(`${verified.brand} ${verified.branchName}`);
  const candidateName = comparableName(candidate.brand);
  const namesOverlap = verifiedName.includes(candidateName) || candidateName.includes(comparableName(verified.brand));
  return namesOverlap && distanceKm(verified.coordinates, candidate.coordinates) <= 0.25;
}

export function mergeNearbyStations(verified: StationSummary[], discovered: StationSummary[]) {
  const uniqueDiscovered = discovered.filter((candidate) => !verified.some((station) => isDuplicate(station, candidate)));
  return [...verified, ...uniqueDiscovered].sort((first, second) => (first.distanceKm ?? Number.POSITIVE_INFINITY) - (second.distanceKm ?? Number.POSITIVE_INFINITY));
}

export async function searchNearbyGoogleStations({ apiKey, center, radiusKm }: { apiKey: string; center: Point; radiusKm: number }) {
  if (!apiKey) return [];
  await new Loader({ apiKey, version: "weekly", libraries: ["marker", "places"] }).load();
  const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
  const { places } = await Place.searchNearby({
    fields: ["id", "displayName", "formattedAddress", "location"],
    includedPrimaryTypes: ["gas_station"],
    locationRestriction: { center, radius: Math.min(Math.max(radiusKm, 1), 50) * 1000 },
    maxResultCount: 20,
    rankPreference: SearchNearbyRankPreference.DISTANCE,
    region: "ng",
  });

  return places.flatMap((place): StationSummary[] => {
    const lat = place.location?.lat();
    const lng = place.location?.lng();
    if (!place.id || !place.displayName || lat === undefined || lng === undefined) return [];
    const coordinates = { lat, lng };
    return [{
      _id: `google:${place.id}`,
      brand: place.displayName,
      branchName: "",
      state: "",
      address: place.formattedAddress || "Address unavailable",
      coordinates,
      status: "UNKNOWN",
      verified: false,
      distanceKm: Math.round(distanceKm(center, coordinates) * 100) / 100,
      lastUpdatedAt: new Date(0).toISOString(),
      currentPrices: [],
    }];
  });
}
