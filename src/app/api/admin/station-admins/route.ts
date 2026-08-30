import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/lib/mongodb";
import Assignment from "@/app/api/model/StationAdminAssignment";
import User from "@/app/api/model/User";
import { requireRoles } from "@/app/api/lib/auth";
export async function POST(request: NextRequest) { const session = requireRoles(request, ["SUPER_ADMIN"]); if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); const { stationId, userId } = await request.json(); if (!stationId || !userId) return NextResponse.json({ error: "stationId and userId are required" }, { status: 400 }); await connectDB(); const existing = await Assignment.findOne({ userId, active: true }); if (existing && existing.stationId.toString() !== stationId) return NextResponse.json({ error: "This admin is already assigned to another station branch." }, { status: 409 }); await User.findByIdAndUpdate(userId, { role: "ADMIN" }); const assignment = await Assignment.findOneAndUpdate({ userId }, { stationId, assignedBy: session.userId, active: true }, { upsert: true, new: true }); return NextResponse.json({ assignment }); }
