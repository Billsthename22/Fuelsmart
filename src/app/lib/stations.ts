export const FUEL_TYPES = ["PMS", "DIESEL", "LPG", "CNG"] as const;
export type FuelType = (typeof FUEL_TYPES)[number];
export type StationStatus = "OPEN" | "CLOSED" | "TEMPORARILY_UNAVAILABLE" | "UNKNOWN";

export type FuelPriceSummary = {
  fuelType: FuelType;
  price: number;
  available: boolean;
  updatedAt: string;
};

export type StationSummary = {
  _id: string;
  brand: string;
  branchName: string;
  state: string;
  address: string;
  coordinates: { lat: number; lng: number };
  status: StationStatus;
  verified: boolean;
  distanceKm: number | null;
  lastUpdatedAt: string;
  currentPrices: FuelPriceSummary[];
};

type DateLike = string | Date;
export type StationDocumentLike = {
  _id: { toString(): string } | string;
  brand: string;
  branchName: string;
  state: string;
  address: string;
  location: { type: "Point"; coordinates: number[] };
  status: StationStatus;
  verified: boolean;
  updatedAt: DateLike;
  currentPrices?: Array<{
    fuelType: FuelType;
    price: number;
    available: boolean;
    updatedAt: DateLike;
  }>;
};

const iso = (value: DateLike) => new Date(value).toISOString();

export function normalizeStation(document: StationDocumentLike, distanceMeters?: number): StationSummary {
  const latestPrices = new Map<FuelType, FuelPriceSummary>();
  for (const price of document.currentPrices || []) {
    const normalized = { fuelType: price.fuelType, price: price.price, available: price.available, updatedAt: iso(price.updatedAt) };
    const previous = latestPrices.get(price.fuelType);
    if (!previous || normalized.updatedAt > previous.updatedAt) latestPrices.set(price.fuelType, normalized);
  }
  const currentPrices = Array.from(latestPrices.values()).sort((a, b) => a.fuelType.localeCompare(b.fuelType));
  const lastUpdatedAt = currentPrices.reduce((latest, price) => price.updatedAt > latest ? price.updatedAt : latest, iso(document.updatedAt));
  const [lng, lat] = document.location.coordinates;
  return {
    _id: document._id.toString(),
    brand: document.brand,
    branchName: document.branchName,
    state: document.state,
    address: document.address,
    coordinates: { lat, lng },
    status: document.status,
    verified: document.verified,
    distanceKm: Number.isFinite(distanceMeters) ? Math.round((distanceMeters! / 1000) * 100) / 100 : null,
    lastUpdatedAt,
    currentPrices,
  };
}
