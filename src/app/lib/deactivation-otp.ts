import { createHash, randomInt } from "crypto";

export function createDeactivationCode() { return String(randomInt(0, 1_000_000)).padStart(6, "0"); }
export function hashDeactivationCode(code: string) { return createHash("sha256").update(code).digest("hex"); }
export function isValidDeactivationCode(code: unknown): code is string { return typeof code === "string" && /^\d{6}$/.test(code); }
