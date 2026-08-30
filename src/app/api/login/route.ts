import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/lib/mongodb";
import User from "@/app/api/model/User";
import { attachSession, verifyPassword } from "@/app/api/lib/auth";
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  if (!user || !user.active || !verifyPassword(password, user.passwordHash)) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  return attachSession(NextResponse.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role } }), user.id, user.role);
}
