import { describe, expect, it } from "vitest";
import { StationSummary } from "./stations";
import { mergeNearbyStations } from "./nearby-stations";

const verified: StationSummary = {
  _id: "verified-1",
  brand: "Mobil",
  branchName: "Wilmer",
  state: "Lagos",
  address: "1 Wilmer Road",
  coordinates: { lat: 6.47, lng: 3.36 },
  status: "OPEN",
  verified: true,
  distanceKm: 1.2,
  lastUpdatedAt: "2026-10-06T09:00:00.000Z",
  currentPrices: [{ fuelType: "PMS", price: 950, available: true, updatedAt: "2026-10-06T09:00:00.000Z" }],
};

const unverified: StationSummary = {
  _id: "google:place-2",
  brand: "Conoil Marine Bridge",
  branchName: "",
  state: "",
  address: "Marine Bridge, Lagos",
  coordinates: { lat: 6.48, lng: 3.37 },
  status: "UNKNOWN",
  verified: false,
  distanceKm: 2.4,
  lastUpdatedAt: "2026-10-06T09:00:00.000Z",
  currentPrices: [],
};

describe("nearby station merging", () => {
  it("keeps Google-only stations unverified and without prices", () => {
    expect(mergeNearbyStations([verified], [unverified])).toEqual([verified, unverified]);
  });

  it("keeps the verified FuelSmart record when a matching Google result overlaps", () => {
    const duplicate = {
      ...unverified,
      _id: "google:mobil-wilmer",
      brand: "Mobil Wilmer Service Station",
      coordinates: { lat: 6.4702, lng: 3.3601 },
      distanceKm: 1.21,
    };
    expect(mergeNearbyStations([verified], [duplicate])).toEqual([verified]);
  });

  it("sorts the combined results nearest first", () => {
    expect(mergeNearbyStations([{ ...verified, distanceKm: 4 }], [{ ...unverified, distanceKm: 1 }]).map((station) => station._id)).toEqual(["google:place-2", "verified-1"]);
  });
});
