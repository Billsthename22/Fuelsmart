import { NextResponse } from "next/server";
import { clearSession } from "@/app/api/lib/auth";
export async function POST() { return clearSession(NextResponse.json({ ok: true })); }
