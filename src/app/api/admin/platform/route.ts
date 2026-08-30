import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/lib/mongodb";
import { requireRoles } from "@/app/api/lib/auth";
import Station from "@/app/api/model/Station";
import User from "@/app/api/model/User";
import Assignment from "@/app/api/model/StationAdminAssignment";
import StationApplication from "@/app/api/model/StationApplication";
import AdminInvite from "@/app/api/model/AdminInvite";

export async function GET(request: NextRequest) {
  if (!requireRoles(request, ["SUPER_ADMIN"])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();
  const [stations, applications, invites, assignments, adminCount, pendingApplications] = await Promise.all([
    Station.find().sort({ createdAt: -1 }).lean(),
    StationApplication.find().sort({ createdAt: -1 }).lean(),
    AdminInvite.find().select("applicationId sentAt usedAt createdAt").lean(),
    Assignment.find({ active: true }).populate("stationId", "brand branchName state status").populate("userId", "username email active role").lean(),
    User.countDocuments({ role: "ADMIN", active: true }),
    StationApplication.countDocuments({ status: "PENDING" }),
  ]);

  const managerByStation = new Map(assignments.map((assignment: any) => [String(assignment.stationId?._id), assignment]));
  const inviteByApplication = new Map(invites.map((invite: any) => [String(invite.applicationId), invite]));
  const applicationRows = applications.map((application: any) => { const invite = inviteByApplication.get(String(application._id)) as any; return { ...application, invitationSent: Boolean(invite?.sentAt || invite?.createdAt), registrationComplete: Boolean(invite?.usedAt) }; });
  const stationRows = stations.map((station: any) => {
    const manager = managerByStation.get(String(station._id)) as any;
    const prices = new Map<string, unknown>();
    for (const price of station.currentPrices || []) prices.set(price.fuelType, price);
    return {
      ...station,
      currentPrices: Array.from(prices.values()),
      manager: manager?.userId || null,
    };
  });

  return NextResponse.json({
    overview: {
      registeredBranches: stations.length,
      verifiedBranches: stations.filter((station: any) => station.verified).length,
      normalAdmins: adminCount,
      pendingApplications,
    },
    stations: stationRows,
    managers: assignments,
    applications: applicationRows,
  });
}
