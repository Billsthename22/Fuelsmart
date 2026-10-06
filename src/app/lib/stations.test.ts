import { describe, expect, it } from "vitest";
import { normalizeStation } from "./stations";

describe("normalizeStation", () => {
  it("returns a stable station summary and keeps the newest price per fuel type", () => {
    const station = normalizeStation({
      _id: "station-1",
      brand: "Mobil",
      branchName: "Wilmer",
      state: "Lagos",
      address: "1 Wilmer Road, Lagos",
      location: { type: "Point", coordinates: [3.36, 6.47] },
      status: "CLOSED",
      verified: true,
      updatedAt: "2026-10-01T08:00:00.000Z",
      currentPrices: [
        { fuelType: "PMS", price: 900, available: true, updatedAt: "2026-10-01T09:00:00.000Z" },
        { fuelType: "DIESEL", price: 1200, available: false, updatedAt: "2026-10-01T10:00:00.000Z" },
        { fuelType: "PMS", price: 950, available: false, updatedAt: "2026-10-01T11:00:00.000Z" },
      ],
    }, 2450);

    expect(station).toEqual({
      _id: "station-1",
      brand: "Mobil",
      branchName: "Wilmer",
      state: "Lagos",
      address: "1 Wilmer Road, Lagos",
      coordinates: { lat: 6.47, lng: 3.36 },
      status: "CLOSED",
      verified: true,
      distanceKm: 2.45,
      lastUpdatedAt: "2026-10-01T11:00:00.000Z",
      currentPrices: [
        { fuelType: "DIESEL", price: 1200, available: false, updatedAt: "2026-10-01T10:00:00.000Z" },
        { fuelType: "PMS", price: 950, available: false, updatedAt: "2026-10-01T11:00:00.000Z" },
      ],
    });
  });

  it("returns no prices and uses the station update time when prices are missing", () => {
    const station = normalizeStation({
      _id: "station-2",
      brand: "NNPC",
      branchName: "Marine Bridge",
      state: "Lagos",
      address: "Marine Bridge, Lagos",
      location: { type: "Point", coordinates: [3.37, 6.46] },
      status: "OPEN",
      verified: true,
      updatedAt: new Date("2026-10-02T08:00:00.000Z"),
      currentPrices: [],
    });

    expect(station.currentPrices).toEqual([]);
    expect(station.distanceKm).toBeNull();
    expect(station.lastUpdatedAt).toBe("2026-10-02T08:00:00.000Z");
  });
});
