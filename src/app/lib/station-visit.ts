export type VisitPhase = "idle" | "approaching" | "arrived" | "prompted";

export function advanceVisit(phase: VisitPhase, distanceMeters: number): VisitPhase {
  if (phase === "approaching" && distanceMeters <= 75) return "arrived";
  if (phase === "arrived" && distanceMeters >= 100) return "prompted";
  return phase;
}

export function distanceBetweenMeters(first: { lat: number; lng: number }, second: { lat: number; lng: number }) {
  const radians = (value: number) => value * Math.PI / 180;
  const lat = radians(second.lat - first.lat);
  const lng = radians(second.lng - first.lng);
  const value = Math.sin(lat / 2) ** 2 + Math.cos(radians(first.lat)) * Math.cos(radians(second.lat)) * Math.sin(lng / 2) ** 2;
  return 6_371_000 * 2 * Math.asin(Math.sqrt(value));
}
