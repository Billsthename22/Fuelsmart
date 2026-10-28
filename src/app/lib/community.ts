export const COMMUNITY_CATEGORIES = ["FUEL_AVAILABLE", "FUEL_UNAVAILABLE", "PRICE_UPDATE", "LONG_QUEUE", "STATION_CLOSED"] as const;
export type CommunityCategory = (typeof COMMUNITY_CATEGORIES)[number];
export type CommunityVote = "ACCURATE" | "OUTDATED";

export const COMMUNITY_CATEGORY_LABELS: Record<CommunityCategory, string> = {
  FUEL_AVAILABLE: "Fuel available",
  FUEL_UNAVAILABLE: "Fuel unavailable",
  PRICE_UPDATE: "Price update",
  LONG_QUEUE: "Long queue",
  STATION_CLOSED: "Station closed",
};

export type CommunityPostSummary = {
  _id: string;
  category: CommunityCategory;
  message: string;
  reportedPrice: number | null;
  fuelType: "PMS" | "DIESEL" | "LPG" | "CNG" | null;
  createdAt: string;
  expiresAt: string;
  author: { _id: string; username: string };
  station: { _id: string; brand: string; branchName: string; address: string; verified: boolean };
  votes: { accurate: number; outdated: number; mine: CommunityVote | null };
};

type PostInput = { stationId?: unknown; station?: unknown; category?: unknown; fuelType?: unknown; message?: unknown; reportedPrice?: unknown };
type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

export function parseCommunityPost(input: PostInput): ParseResult<{ stationId: string; category: CommunityCategory; fuelType: "PMS" | "DIESEL" | "LPG" | "CNG" | null; message: string; reportedPrice: number | null }> {
  const stationId = typeof input.stationId === "string" ? input.stationId.trim() : "";
  if (!stationId) return { ok: false, error: "Select a fuel station." };
  if (typeof input.category !== "string" || !COMMUNITY_CATEGORIES.includes(input.category as CommunityCategory)) return { ok: false, error: "Select a valid report category." };
  const category = input.category as CommunityCategory;
  const fuelSpecific = category === "FUEL_AVAILABLE" || category === "FUEL_UNAVAILABLE" || category === "PRICE_UPDATE";
  const validFuels = ["PMS", "DIESEL", "LPG", "CNG"] as const;
  if (fuelSpecific && (typeof input.fuelType !== "string" || !validFuels.includes(input.fuelType as typeof validFuels[number]))) return { ok: false, error: "Select the fuel type." };
  const fuelType = fuelSpecific ? input.fuelType as typeof validFuels[number] : null;
  const price = Number(input.reportedPrice);
  if (category === "PRICE_UPDATE" && (!Number.isFinite(price) || price <= 0)) return { ok: false, error: "Enter the current fuel price." };
  const message = typeof input.message === "string" ? input.message.trim().slice(0, 280) : "";
  return { ok: true, value: { stationId, category, fuelType, message, reportedPrice: category === "PRICE_UPDATE" ? price : null } };
}

export function parseCommunityVote(value: unknown): ParseResult<CommunityVote> {
  return value === "ACCURATE" || value === "OUTDATED" ? { ok: true, value } : { ok: false, error: "Choose a valid accuracy vote." };
}
