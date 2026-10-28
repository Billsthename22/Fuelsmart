export type TravelMode = "driving" | "walking";

export type RouteCandidate = {
  distanceMeters?: number;
  durationMillis?: number | null;
};

export function pickShortestRoute<T extends RouteCandidate>(routes: T[]): T | null {
  if (!routes.length) return null;
  return routes.reduce((shortest, route) =>
    (route.distanceMeters ?? Number.POSITIVE_INFINITY) < (shortest.distanceMeters ?? Number.POSITIVE_INFINITY)
      ? route
      : shortest,
  );
}

export function buildGoogleMapsDirectionsUrl(
  origin: { lat: number; lng: number } | null,
  destination: { lat: number; lng: number },
  mode: TravelMode,
) {
  const params = new URLSearchParams({ api: "1" });
  if (origin) params.set("origin", `${origin.lat},${origin.lng}`);
  params.set("destination", `${destination.lat},${destination.lng}`);
  params.set("travelmode", mode);
  params.set("dir_action", "navigate");
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
