import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "../model/User";
const COOKIE_NAME = "fuelsmart_session"; const MAX_AGE = 60 * 60 * 24 * 7;
type Session = { userId: string; role: UserRole; exp: number };
const secret = () => { if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing"); return process.env.JWT_SECRET; };
const encode = (v: string) => Buffer.from(v).toString("base64url"); const decode = (v: string) => Buffer.from(v, "base64url").toString("utf8");
export function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); return `${salt}:${pbkdf2Sync(password, salt, 310000, 32, "sha256").toString("hex")}`; }
export function verifyPassword(password: string, stored: string) { const [salt, expected] = stored.split(":"); if (!salt || !expected) return false; const actual = pbkdf2Sync(password, salt, 310000, 32, "sha256").toString("hex"); return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex")); }
export function createSession(userId: string, role: UserRole) { const payload: Session = { userId, role, exp: Math.floor(Date.now() / 1000) + MAX_AGE }; const body = encode(JSON.stringify(payload)); return `${body}.${createHmac("sha256", secret()).update(body).digest("base64url")}`; }
export function readSession(request: NextRequest): Session | null { const token = request.cookies.get(COOKIE_NAME)?.value; if (!token) return null; const [body, signature] = token.split("."); if (!body || !signature) return null; const expected = createHmac("sha256", secret()).update(body).digest("base64url"); if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null; const payload = JSON.parse(decode(body)) as Session; return payload.exp > Math.floor(Date.now() / 1000) ? payload : null; }
export function attachSession(response: NextResponse, userId: string, role: UserRole) { response.cookies.set(COOKIE_NAME, createSession(userId, role), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE }); return response; }
export function clearSession(response: NextResponse) { response.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 }); return response; }
export function requireRoles(request: NextRequest, roles: UserRole[]) { const session = readSession(request); return session && roles.includes(session.role) ? session : null; }
