import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/lib/mongodb";
import { requireRoles } from "@/app/api/lib/auth";
import User from "@/app/api/model/User";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  if (!requireRoles(request, ["SUPER_ADMIN"])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { active } = await request.json();
  if (typeof active !== "boolean") return NextResponse.json({ error: "active must be true or false" }, { status: 400 });
  await connectDB();
  const user = await User.findOneAndUpdate({ _id: (await params).userId, role: "ADMIN" }, { active }, { new: true }).lean();
  return user ? NextResponse.json({ user }) : NextResponse.json({ error: "Normal admin not found" }, { status: 404 });
}
