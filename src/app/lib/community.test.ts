import { describe, expect, it } from "vitest";
import { parseCommunityPost, parseCommunityVote } from "./community";

describe("community reports", () => {
  it("requires a station and a supported category", () => {
    expect(parseCommunityPost({ stationId: "", category: "LONG_QUEUE" })).toEqual({ ok: false, error: "Select a fuel station." });
    expect(parseCommunityPost({ stationId: "station-1", category: "OTHER" })).toEqual({ ok: false, error: "Select a valid report category." });
  });

  it("requires a valid price for price updates", () => {
    expect(parseCommunityPost({ stationId: "station-1", category: "PRICE_UPDATE", fuelType: "PMS", reportedPrice: 0 })).toEqual({ ok: false, error: "Enter the current fuel price." });
  });

  it("requires a fuel type for fuel-specific reports", () => {
    expect(parseCommunityPost({ stationId: "station-1", category: "FUEL_AVAILABLE" })).toEqual({ ok: false, error: "Select the fuel type." });
  });

  it("normalizes valid reports and limits the message length", () => {
    expect(parseCommunityPost({ stationId: "station-1", category: "FUEL_AVAILABLE", fuelType: "PMS", message: `  ${"a".repeat(400)}  ` })).toEqual({
      ok: true,
      value: { stationId: "station-1", category: "FUEL_AVAILABLE", fuelType: "PMS", message: "a".repeat(280), reportedPrice: null },
    });
  });

  it("accepts only accuracy votes", () => {
    expect(parseCommunityVote("ACCURATE")).toEqual({ ok: true, value: "ACCURATE" });
    expect(parseCommunityVote("LIKE")).toEqual({ ok: false, error: "Choose a valid accuracy vote." });
  });
});
