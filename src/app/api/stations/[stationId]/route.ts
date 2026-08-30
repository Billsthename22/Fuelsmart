import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/lib/mongodb";
import Station from "@/app/api/model/Station";
import { requireRoles } from "@/app/api/lib/auth";
export async function GET(_: NextRequest, { params }: { params: Promise<{ stationId: string }> }) { await connectDB(); const station = await Station.findById((await params).stationId).lean(); return station ? NextResponse.json({ station }) : NextResponse.json({ error: "Station not found" }, { status: 404 }); }
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ stationId: string }> }) { if (!requireRoles(request, ["SUPER_ADMIN"])) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); const updates = await request.json(); delete updates.currentPrices; delete updates.location; await connectDB(); const station = await Station.findByIdAndUpdate((await params).stationId, updates, { new: true, runValidators: true }); return station ? NextResponse.json({ station }) : NextResponse.json({ error: "Station not found" }, { status: 404 }); }
