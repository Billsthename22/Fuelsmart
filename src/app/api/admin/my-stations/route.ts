import { NextRequest, NextResponse } from "next/server";
import { requireRoles } from "@/app/api/lib/auth";
import { connectDB } from "@/app/api/lib/mongodb";
import Assignment from "@/app/api/model/StationAdminAssignment";

export async function GET(request: NextRequest) {
  const session = requireRoles(request, ["ADMIN", "SUPER_ADMIN"]);
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();
  const assignments = await Assignment.find(session.role === "SUPER_ADMIN" ? {} : { userId: session.userId, active: true }).populate("stationId").lean();
  const stations = assignments.map((item) => item.stationId).filter(Boolean).map((station: any) => {
    const prices = new Map<string, unknown>();
    for (const price of station.currentPrices || []) prices.set(price.fuelType, price);
    return { ...station, currentPrices: Array.from(prices.values()) };
  });
  return NextResponse.json({ stations });
}
