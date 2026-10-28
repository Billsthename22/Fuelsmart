import { describe, expect, it } from "vitest";
import { parseDriverSettings, parsePasswordChange } from "./user-settings";

describe("driver settings validation", () => {
  it("normalizes a complete profile, preferences, and primary vehicle", () => {
    expect(parseDriverSettings({
      fullName: "  Ada Okafor  ",
      username: "  ada_okafor  ",
      phone: "  +234 801 234 5678 ",
      state: "  Lagos ",
      city: "  Yaba ",
      preferredFuelType: "PMS",
      defaultRadiusKm: 10,
      notifications: { stationUpdates: true, communityUpdates: false },
      vehicle: { make: " Toyota ", model: " Corolla ", year: 2021, fuelType: "PMS", plateNumber: "  KJA 123 AB " },
    })).toEqual({
      ok: true,
      value: {
        fullName: "Ada Okafor", username: "ada_okafor", phone: "+234 801 234 5678", state: "Lagos", city: "Yaba",
        preferredFuelType: "PMS", defaultRadiusKm: 10,
        notifications: { stationUpdates: true, communityUpdates: false },
        vehicle: { make: "Toyota", model: "Corolla", year: 2021, fuelType: "PMS", plateNumber: "KJA 123 AB" },
      },
    });
  });

  it("rejects unsupported fuel preferences and an invalid radius", () => {
    expect(parseDriverSettings({ fullName: "Ada", username: "ada", preferredFuelType: "KEROSENE", defaultRadiusKm: 100 })).toEqual({ ok: false, error: "Select a valid preferred fuel type." });
    expect(parseDriverSettings({ fullName: "Ada", username: "ada", preferredFuelType: "PMS", defaultRadiusKm: 0 })).toEqual({ ok: false, error: "Choose a search radius between 1 and 50 km." });
  });

  it("allows an empty optional vehicle but rejects an incomplete one", () => {
    expect(parseDriverSettings({ fullName: "Ada", username: "ada", preferredFuelType: "PMS", defaultRadiusKm: 5, vehicle: {} })).toMatchObject({ ok: true, value: { vehicle: null } });
    expect(parseDriverSettings({ fullName: "Ada", username: "ada", preferredFuelType: "PMS", defaultRadiusKm: 5, vehicle: { fuelType: "PMS" } })).toMatchObject({ ok: true, value: { vehicle: null } });
    expect(parseDriverSettings({ fullName: "Ada", username: "ada", preferredFuelType: "PMS", defaultRadiusKm: 5, vehicle: { make: "Toyota" } })).toEqual({ ok: false, error: "Enter both the vehicle make and model, or leave the vehicle empty." });
  });
});

describe("password change validation", () => {
  it("requires a current password and a secure confirmed replacement", () => {
    expect(parsePasswordChange({ currentPassword: "", newPassword: "newpassword", confirmPassword: "newpassword" })).toEqual({ ok: false, error: "Enter your current password." });
    expect(parsePasswordChange({ currentPassword: "oldpassword", newPassword: "short", confirmPassword: "short" })).toEqual({ ok: false, error: "Your new password must be at least 8 characters." });
    expect(parsePasswordChange({ currentPassword: "oldpassword", newPassword: "newpassword", confirmPassword: "different" })).toEqual({ ok: false, error: "Your new passwords do not match." });
  });

  it("accepts a valid confirmed password change", () => {
    expect(parsePasswordChange({ currentPassword: "oldpassword", newPassword: "newpassword", confirmPassword: "newpassword" })).toEqual({ ok: true, value: { currentPassword: "oldpassword", newPassword: "newpassword" } });
  });
});
