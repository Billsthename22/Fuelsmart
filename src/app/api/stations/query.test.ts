import { describe, expect, it } from "vitest";
import { parseStationQuery } from "./query";

describe("parseStationQuery", () => {
  it("uses an 8 km default and accepts paired coordinates", () => {
    expect(parseStationQuery(new URLSearchParams("lat=6.45&lng=3.39"))).toEqual({
      ok: true,
      value: { lat: 6.45, lng: 3.39, radiusKm: 8, fuelType: null, available: null, search: "" },
    });
  });

  it.each([["0", 1], ["100", 50]])("clamps radius %s to %s km", (radius, expected) => {
    const result = parseStationQuery(new URLSearchParams(`lat=6&lng=3&radiusKm=${radius}`));
    expect(result.ok && result.value.radiusKm).toBe(expected);
  });

  it("rejects a coordinate when its pair is missing", () => {
    expect(parseStationQuery(new URLSearchParams("lat=6.45"))).toEqual({ ok: false, status: 400, error: "Latitude and longitude must be provided together." });
  });

  it("rejects nonnumeric and out-of-range coordinates", () => {
    expect(parseStationQuery(new URLSearchParams("lat=nope&lng=3"))).toMatchObject({ ok: false, status: 400 });
    expect(parseStationQuery(new URLSearchParams("lat=91&lng=181"))).toMatchObject({ ok: false, status: 400 });
  });

  it("parses optional server-side filters", () => {
    expect(parseStationQuery(new URLSearchParams("fuelType=PMS&available=true&search=%20mobil%20"))).toEqual({
      ok: true,
      value: { lat: null, lng: null, radiusKm: 8, fuelType: "PMS", available: true, search: "mobil" },
    });
  });
});
