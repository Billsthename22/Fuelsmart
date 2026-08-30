import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/lib/mongodb";
import Station from "@/app/api/model/Station";
import { requireRoles } from "@/app/api/lib/auth";
export async function GET(request: NextRequest) { const p = new URL(request.url).searchParams; const lat = Number(p.get("lat")), lng = Number(p.get("lng")), radiusKm = Math.min(Math.max(Number(p.get("radiusKm") ?? 8), 1), 50); await connectDB(); const query = Number.isFinite(lat) && Number.isFinite(lng) ? { location: { $near: { $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: radiusKm * 1000 } }, status: "OPEN", verified: true } : { status: "OPEN", verified: true }; return NextResponse.json({ stations: await Station.find(query).limit(100).lean() }); }
export async function POST() { return NextResponse.json({ error: "Stations are created only when a super admin approves a station-owner application." }, { status: 403 }); }
