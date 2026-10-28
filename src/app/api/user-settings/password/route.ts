import { NextRequest, NextResponse } from "next/server";
import { hashPassword, requireRoles, verifyPassword } from "@/app/api/lib/auth";
import { connectDB } from "@/app/api/lib/mongodb";
import User from "@/app/api/model/User";
import { parsePasswordChange } from "@/app/lib/user-settings";

export async function PATCH(request: NextRequest) {
  const session = requireRoles(request, ["DRIVER"]);
  if (!session) return NextResponse.json({ error: "Log in with a user account to change your password." }, { status: 401 });
  const parsed = parsePasswordChange(await request.json());
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  await connectDB();
  const user = await User.findOne({ _id: session.userId, active: true }).select("+passwordHash");
  if (!user || !verifyPassword(parsed.value.currentPassword, user.passwordHash)) return NextResponse.json({ error: "Your current password is incorrect." }, { status: 400 });
  user.passwordHash = hashPassword(parsed.value.newPassword);
  await user.save();
  return NextResponse.json({ ok: true });
}
