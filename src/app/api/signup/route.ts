
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/lib/mongodb";
import User from "@/app/api/model/User";
import { attachSession, hashPassword } from "@/app/api/lib/auth";
export async function POST(request: NextRequest) {
  const { fullName, username, email, password } = await request.json();
  if (!fullName?.trim() || !username || !email || !password || password.length < 8) return NextResponse.json({ error: "Your full name, username, email, and a password of at least 8 characters are required." }, { status: 400 });
  await connectDB();
  if (await User.exists({ $or: [{ email: email.toLowerCase() }, { username }] })) return NextResponse.json({ error: "An account with that email or username already exists." }, { status: 409 });
  const normalizedEmail = email.toLowerCase();
  const role = process.env.SUPER_ADMIN_EMAIL?.toLowerCase() === normalizedEmail ? "SUPER_ADMIN" : "DRIVER";
  const user = await User.create({ fullName: fullName.trim().slice(0, 80), username, email: normalizedEmail, passwordHash: hashPassword(password), role });
  return attachSession(NextResponse.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role } }, { status: 201 }), user.id, user.role);
}
