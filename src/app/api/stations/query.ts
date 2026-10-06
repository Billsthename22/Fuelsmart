import { FUEL_TYPES, FuelType } from "@/app/lib/stations";

export type StationQuery = {
  lat: number | null;
  lng: number | null;
  radiusKm: number;
  fuelType: FuelType | null;
  available: boolean | null;
  search: string;
};

export type ParsedStationQuery =
  | { ok: true; value: StationQuery }
  | { ok: false; status: 400; error: string };

export function parseStationQuery(params: URLSearchParams): ParsedStationQuery {
  const rawLat = params.get("lat");
  const rawLng = params.get("lng");
  if ((rawLat === null) !== (rawLng === null)) return { ok: false, status: 400, error: "Latitude and longitude must be provided together." };

  let lat: number | null = null;
  let lng: number | null = null;
  if (rawLat !== null && rawLng !== null) {
    lat = Number(rawLat); lng = Number(rawLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return { ok: false, status: 400, error: "Latitude or longitude is invalid." };
    }
  }

  const requestedRadius = Number(params.get("radiusKm") ?? 8);
  const radiusKm = Math.min(Math.max(Number.isFinite(requestedRadius) ? requestedRadius : 8, 1), 50);
  const rawFuel = params.get("fuelType");
  const fuelType = rawFuel && FUEL_TYPES.includes(rawFuel as FuelType) ? rawFuel as FuelType : null;
  const rawAvailable = params.get("available");
  const available = rawAvailable === "true" ? true : rawAvailable === "false" ? false : null;

  return { ok: true, value: { lat, lng, radiusKm, fuelType, available, search: (params.get("search") || "").trim() } };
}
