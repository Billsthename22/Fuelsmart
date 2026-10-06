import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/lib/mongodb";
import Station from "@/app/api/model/Station";
import { normalizeStation } from "@/app/lib/stations";
import { parseStationQuery, StationQuery } from "./query";

function mongoFilters(query: StationQuery) {
  const filters: Record<string, unknown> = { verified: true };
  if (query.search) {
    const safe = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const search = new RegExp(safe, "i");
    filters.$or = [{ brand: search }, { branchName: search }, { address: search }, { state: search }];
  }
  if (query.fuelType || query.available !== null) {
    filters.currentPrices = { $elemMatch: {
      ...(query.fuelType ? { fuelType: query.fuelType } : {}),
      ...(query.available !== null ? { available: query.available } : {}),
    } };
  }
  return filters;
}

export async function GET(request: NextRequest) {
  const parsed = parseStationQuery(new URL(request.url).searchParams);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  await connectDB();
  const filters = mongoFilters(parsed.value);
  if (parsed.value.lat !== null && parsed.value.lng !== null) {
    const stations = await Station.aggregate([{ $geoNear: { near: { type: "Point", coordinates: [parsed.value.lng, parsed.value.lat] }, distanceField: "distanceMeters", maxDistance: parsed.value.radiusKm * 1000, spherical: true, query: filters } }, { $limit: 50 }]);
    return NextResponse.json({ stations: stations.map((station) => normalizeStation(station, station.distanceMeters)) });
  }
  const stations = await Station.find(filters).sort({ updatedAt: -1 }).limit(50).lean();
  return NextResponse.json({ stations: stations.map((station: any) => normalizeStation(station)) });
}

export async function POST() {
  return NextResponse.json({ error: "Stations are created only when a super admin approves a station-owner application." }, { status: 403 });
}
