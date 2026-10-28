import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StationSummary } from "@/app/lib/stations";
import FuelStationMap from "./FuelStationMap";
import StationDetailsPanel from "./StationDetailsPanel";

const load = vi.fn().mockResolvedValue(undefined);
const computeRoutesMock = vi.fn();
const createPolylinesMock = vi.fn();
const markerOptions: Array<Record<string, unknown>> = [];
vi.mock("@googlemaps/js-api-loader", () => ({ Loader: class { load = load; } }));

const station: StationSummary = {
  _id: "station-1", brand: "Mobil", branchName: "Wilmer", state: "Lagos", address: "1 Wilmer Road",
  coordinates: { lat: 6.47, lng: 3.36 }, status: "OPEN", verified: true, distanceKm: 2.45,
  lastUpdatedAt: "2026-10-06T09:00:00.000Z",
  currentPrices: [{ fuelType: "PMS", price: 950, available: true, updatedAt: "2026-10-06T09:00:00.000Z" }],
};

const fartherStation: StationSummary = {
  ...station,
  _id: "station-2",
  brand: "TotalEnergies",
  branchName: "",
  distanceKm: 4.1,
  status: "UNKNOWN",
  verified: false,
  currentPrices: [],
};

describe("registered station map", () => {
  beforeEach(() => {
    computeRoutesMock.mockResolvedValue({ routes: [] });
    createPolylinesMock.mockReturnValue([{ setMap: vi.fn() }]);
    markerOptions.length = 0;
    Object.assign(globalThis, { google: { maps: {
      Map: class { setCenter = vi.fn(); setZoom = vi.fn(); panTo = vi.fn(); fitBounds = vi.fn(); addListener = vi.fn(); },
      LatLngBounds: class { extend = vi.fn(); isEmpty = () => false; },
      Circle: class { setMap = vi.fn(); },
      TravelMode: { DRIVING: "DRIVING", WALKING: "WALKING" },
      importLibrary: vi.fn().mockResolvedValue({ Route: { computeRoutes: computeRoutesMock } }),
      marker: { AdvancedMarkerElement: class { map: unknown; position: unknown; content: unknown; addListener = vi.fn(); constructor(value: Record<string, unknown>) { markerOptions.push(value); Object.assign(this, value); } } },
    } } });
    vi.clearAllMocks();
  });

  it("shows a useful message when the Google Maps key is missing", () => {
    render(<FuelStationMap apiKey="" stations={[station]} selectedStationId="station-1" userLocation={null} radiusKm={8} onSelect={vi.fn()} onClearSelection={vi.fn()} />);
    expect(screen.getByText(/Google Maps is not configured/i)).toBeInTheDocument();
  });

  it("shows a retryable station API error", () => {
    const retry = vi.fn();
    render(<FuelStationMap apiKey="key" stations={[]} selectedStationId={null} userLocation={null} radiusKm={8} onSelect={vi.fn()} onClearSelection={vi.fn()} error="Could not load stations" onRetry={retry} />);
    expect(screen.getByText("Could not load stations")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("keeps the full map clear until a station is selected", async () => {
    render(<FuelStationMap apiKey="key" stations={[station, fartherStation]} selectedStationId={null} userLocation={{ lat: 6.45, lng: 3.39 }} radiusKm={8} onSelect={vi.fn()} onClearSelection={vi.fn()} />);
    await waitFor(() => expect(load).toHaveBeenCalled());
    expect(screen.queryByText(/Mobil — Wilmer/i)).not.toBeInTheDocument();
  });

  it("shows the selected real station and builds its external navigation URL", () => {
    render(<StationDetailsPanel station={station} userLocation={null} travelMode="driving" onTravelModeChange={vi.fn()} onDirections={vi.fn()} onClose={vi.fn()} directionsAvailable={false} routeSummary={null} routing={false} />);
    expect(screen.getByText(/Mobil — Wilmer/i)).toBeInTheDocument();
    expect(screen.getByText(/₦950/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /choose your location/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /drive/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /walk/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open Google Maps/i })).toHaveAttribute("href", "https://www.google.com/maps/dir/?api=1&destination=6.47%2C3.36&travelmode=driving&dir_action=navigate");
  });

  it("uses a compact right-side station card on desktop", async () => {
    render(<FuelStationMap apiKey="key" stations={[station]} selectedStationId="station-1" userLocation={{ lat: 6.45, lng: 3.39 }} radiusKm={8} onSelect={vi.fn()} onClearSelection={vi.fn()} />);
    await waitFor(() => expect(load).toHaveBeenCalled());
    expect(screen.getByTestId("station-details-positioner")).toHaveClass("lg:top-24", "lg:bottom-auto", "lg:w-[390px]");
  });

  it("requests the shortest driving route from the user to the selected station", async () => {
    computeRoutesMock.mockResolvedValue({ routes: [{ distanceMeters: 1_250, durationMillis: 360_000, viewport: {}, createPolylines: createPolylinesMock }] });
    render(<FuelStationMap apiKey="key" stations={[station]} selectedStationId="station-1" userLocation={{ lat: 6.45, lng: 3.39 }} radiusKm={8} onSelect={vi.fn()} onClearSelection={vi.fn()} />);
    await waitFor(() => expect(load).toHaveBeenCalled());
    fireEvent.click(await screen.findByRole("button", { name: /show shortest route/i }));
    await waitFor(() => expect(computeRoutesMock).toHaveBeenCalledWith(expect.objectContaining({
      origin: { lat: 6.45, lng: 3.39 },
      destination: { lat: 6.47, lng: 3.36 },
      travelMode: "DRIVING",
      requestedReferenceRoutes: ["SHORTER_DISTANCE"],
    })));
    await waitFor(() => expect(createPolylinesMock).toHaveBeenCalledWith({ polylineOptions: expect.objectContaining({ strokeColor: "#2563eb", strokeWeight: 8 }) }));
    expect(markerOptions.some((options) => options.title === "Your driving progress")).toBe(true);
  });
});
