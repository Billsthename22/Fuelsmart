export const FUEL_TYPES = ["PMS", "DIESEL", "LPG", "CNG"] as const;
export type FuelType = (typeof FUEL_TYPES)[number];

export type DriverSettings = {
  fullName: string;
  username: string;
  phone: string;
  state: string;
  city: string;
  preferredFuelType: FuelType;
  defaultRadiusKm: number;
  notifications: { stationUpdates: boolean; communityUpdates: boolean };
  vehicle: { make: string; model: string; year: number | null; fuelType: FuelType; plateNumber: string } | null;
};

type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };
const text = (value: unknown, maximum = 120) => typeof value === "string" ? value.trim().slice(0, maximum) : "";
const isFuelType = (value: unknown): value is FuelType => typeof value === "string" && FUEL_TYPES.includes(value as FuelType);

export function parseDriverSettings(body: Record<string, unknown>): ParseResult<DriverSettings> {
  const fullName = text(body.fullName, 80);
  const username = text(body.username, 30);
  if (!fullName) return { ok: false, error: "Enter your full name." };
  if (username.length < 3) return { ok: false, error: "Your username must be at least 3 characters." };
  if (!isFuelType(body.preferredFuelType)) return { ok: false, error: "Select a valid preferred fuel type." };
  const defaultRadiusKm = Number(body.defaultRadiusKm);
  if (!Number.isInteger(defaultRadiusKm) || defaultRadiusKm < 1 || defaultRadiusKm > 50) return { ok: false, error: "Choose a search radius between 1 and 50 km." };
  const rawNotifications = body.notifications as Record<string, unknown> | undefined;
  const rawVehicle = body.vehicle as Record<string, unknown> | undefined;
  const make = text(rawVehicle?.make, 60);
  const model = text(rawVehicle?.model, 60);
  const plateNumber = text(rawVehicle?.plateNumber, 30);
  let vehicle: DriverSettings["vehicle"] = null;
  if (make || model || plateNumber || rawVehicle?.year) {
    if (!make || !model) return { ok: false, error: "Enter both the vehicle make and model, or leave the vehicle empty." };
    if (!isFuelType(rawVehicle?.fuelType)) return { ok: false, error: "Select a valid vehicle fuel type." };
    const parsedYear = rawVehicle?.year === "" || rawVehicle?.year === undefined || rawVehicle?.year === null ? null : Number(rawVehicle.year);
    if (parsedYear !== null && (!Number.isInteger(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear() + 1)) return { ok: false, error: "Enter a valid vehicle year." };
    vehicle = { make, model, year: parsedYear, fuelType: rawVehicle.fuelType, plateNumber };
  }
  return { ok: true, value: {
    fullName, username, phone: text(body.phone, 30), state: text(body.state, 60), city: text(body.city, 60), preferredFuelType: body.preferredFuelType, defaultRadiusKm,
    notifications: { stationUpdates: rawNotifications?.stationUpdates !== false, communityUpdates: rawNotifications?.communityUpdates !== false }, vehicle,
  } };
}

export function parsePasswordChange(body: Record<string, unknown>): ParseResult<{ currentPassword: string; newPassword: string }> {
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";
  if (!currentPassword) return { ok: false, error: "Enter your current password." };
  if (newPassword.length < 8) return { ok: false, error: "Your new password must be at least 8 characters." };
  if (newPassword !== confirmPassword) return { ok: false, error: "Your new passwords do not match." };
  return { ok: true, value: { currentPassword, newPassword } };
}
