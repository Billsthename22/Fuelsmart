import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/app/api/lib/auth";
import { connectDB } from "@/app/api/lib/mongodb";
import User from "@/app/api/model/User";
export async function GET(request: NextRequest) { const session = readSession(request); if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); await connectDB(); const user = await User.findById(session.userId).select("username email role active"); if (!user?.active) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); return NextResponse.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role } }); }
