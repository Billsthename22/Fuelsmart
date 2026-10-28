import { describe, expect, it } from "vitest";
import { buildGoogleMapsDirectionsUrl, pickShortestRoute } from "./station-routing";

describe("station routing", () => {
  it("picks the route with the shortest road distance", () => {
    const routes = [
      { distanceMeters: 4_800, durationMillis: 540_000 },
      { distanceMeters: 1_250, durationMillis: 720_000 },
      { distanceMeters: 2_100, durationMillis: 360_000 },
    ];

    expect(pickShortestRoute(routes)).toBe(routes[1]);
  });

  it("returns null when Google does not return a route", () => {
    expect(pickShortestRoute([])).toBeNull();
  });

  it("builds Google Maps directions for the selected travel mode", () => {
    expect(buildGoogleMapsDirectionsUrl({ lat: 6.45, lng: 3.39 }, { lat: 6.47, lng: 3.36 }, "walking"))
      .toBe("https://www.google.com/maps/dir/?api=1&origin=6.45%2C3.39&destination=6.47%2C3.36&travelmode=walking&dir_action=navigate");
  });
});
