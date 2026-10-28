import { NextRequest, NextResponse } from "next/server";
import { clearSession, requireRoles } from "@/app/api/lib/auth";
import { connectDB } from "@/app/api/lib/mongodb";
import User from "@/app/api/model/User";
import DeactivationOtp from "@/app/api/model/DeactivationOtp";
import { hashDeactivationCode, isValidDeactivationCode } from "@/app/lib/deactivation-otp";

export async function POST(request: NextRequest) {
  const session = requireRoles(request, ["DRIVER"]);
  if (!session) return NextResponse.json({ error: "Log in with a user account to deactivate it." }, { status: 401 });
  const { code } = await request.json();
  if (!isValidDeactivationCode(code)) return NextResponse.json({ error: "Enter the 6-digit verification code." }, { status: 400 });
  await connectDB();
  const otp = await DeactivationOtp.findOne({ userId: session.userId });
  if (!otp || otp.expiresAt <= new Date()) return NextResponse.json({ error: "This verification code has expired. Request a new one." }, { status: 400 });
  if (otp.attempts >= 5) return NextResponse.json({ error: "Too many attempts. Request a new verification code." }, { status: 429 });
  if (otp.codeHash !== hashDeactivationCode(code)) { otp.attempts += 1; await otp.save(); return NextResponse.json({ error: "That verification code is incorrect." }, { status: 400 }); }
  const user = await User.findOneAndUpdate({ _id: session.userId, active: true }, { $set: { active: false } });
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });
  await DeactivationOtp.deleteOne({ _id: otp._id });
  return clearSession(NextResponse.json({ ok: true }));
}
