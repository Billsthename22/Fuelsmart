import { NextRequest, NextResponse } from "next/server";
import { requireRoles } from "@/app/api/lib/auth";
import { connectDB } from "@/app/api/lib/mongodb";
import User from "@/app/api/model/User";
import CommunityPost from "@/app/api/model/CommunityPost";
import { parseDriverSettings } from "@/app/lib/user-settings";

const userFields = "username email role fullName phone state city preferredFuelType defaultRadiusKm notifications vehicle createdAt";
type StoredUser = Record<string, unknown> & { _id: { toString(): string } };

export async function GET(request: NextRequest) {
  const session = requireRoles(request, ["DRIVER"]);
  if (!session) return NextResponse.json({ error: "Log in with a user account to manage settings." }, { status: 401 });
  await connectDB();
  const user = await User.findOne({ _id: session.userId, active: true }).select(userFields).lean() as unknown as StoredUser | null;
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });
  const reportsSubmitted = await CommunityPost.countDocuments({ authorId: session.userId, hidden: false });
  return NextResponse.json({ user: { ...user, id: user._id.toString(), reportsSubmitted } });
}

export async function PATCH(request: NextRequest) {
  const session = requireRoles(request, ["DRIVER"]);
  if (!session) return NextResponse.json({ error: "Log in with a user account to update settings." }, { status: 401 });
  const parsed = parseDriverSettings(await request.json());
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  await connectDB();
  const duplicate = await User.exists({ username: parsed.value.username, _id: { $ne: session.userId } });
  if (duplicate) return NextResponse.json({ error: "That username is already in use." }, { status: 409 });
  const user = await User.findOneAndUpdate({ _id: session.userId, active: true }, { $set: parsed.value }, { new: true, runValidators: true }).select(userFields).lean() as unknown as StoredUser | null;
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });
  return NextResponse.json({ user: { ...user, id: user._id.toString() } });
}
