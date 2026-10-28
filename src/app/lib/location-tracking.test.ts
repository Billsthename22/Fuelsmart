import { describe, expect, it } from "vitest";
import { shouldTrackDeviceLocation } from "./location-tracking";

describe("device location tracking", () => {
  it("continues tracking the device after the map opens with URL coordinates", () => {
    expect(shouldTrackDeviceLocation({ lat: 6.5244, lng: 3.3792 })).toBe(true);
  });

  it("tracks the device when no URL location was supplied", () => {
    expect(shouldTrackDeviceLocation(null)).toBe(true);
  });
});
