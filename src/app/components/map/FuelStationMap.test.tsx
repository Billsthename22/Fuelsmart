import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StationSummary } from "@/app/lib/stations";
import FuelStationMap from "./FuelStationMap";
import NearbyMapStationList from "./NearbyMapStationList";
import StationDetailsPanel from "./StationDetailsPanel";

const load = vi.fn().mockResolvedValue(undefined);
const routeMock = vi.fn();
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
    routeMock.mockImplementation((_request, callback) => callback({ routes: [] }, "OK"));
    Object.assign(globalThis, { google: { maps: {
      Map: class { setCenter = vi.fn(); setZoom = vi.fn(); panTo = vi.fn(); fitBounds = vi.fn(); },
      LatLngBounds: class { extend = vi.fn(); isEmpty = () => false; },
      DirectionsRenderer: class { setDirections = vi.fn(); setMap = vi.fn(); },
      DirectionsService: class { route = routeMock; },
      TravelMode: { DRIVING: "DRIVING" },
      marker: { AdvancedMarkerElement: class { map: unknown; position: unknown; addListener = vi.fn(); constructor(value: object) { Object.assign(this, value); } } },
    } } });
    vi.clearAllMocks();
  });

  it("shows a useful message when the Google Maps key is missing", () => {
    render(<FuelStationMap apiKey="" stations={[station]} selectedStationId="station-1" userLocation={null} onSelect={vi.fn()} />);
    expect(screen.getByText(/Google Maps is not configured/i)).toBeInTheDocument();
  });

  it("shows a retryable station API error", () => {
    const retry = vi.fn();
    render(<FuelStationMap apiKey="key" stations={[]} selectedStationId={null} userLocation={null} onSelect={vi.fn()} error="Could not load stations" onRetry={retry} />);
    expect(screen.getByText("Could not load stations")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("shows nearby stations without requiring a search and selects one", () => {
    const select = vi.fn();
    render(<NearbyMapStationList stations={[station, fartherStation]} selectedStationId="station-1" onSelect={select} />);
    expect(screen.getByText("2 stations near you")).toBeInTheDocument();
    expect(screen.getByText(/Mobil — Wilmer/i)).toBeInTheDocument();
    expect(screen.getByText("Unverified")).toBeInTheDocument();
    expect(screen.getByText("Prices unavailable")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /TotalEnergies/i }));
    expect(select).toHaveBeenCalledWith("station-2");
  });

  it("shows the selected real station and builds its external navigation URL", () => {
    render(<StationDetailsPanel station={station} onDirections={vi.fn()} directionsAvailable={false} />);
    expect(screen.getByText(/Mobil — Wilmer/i)).toBeInTheDocument();
    expect(screen.getByText(/₦950/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /choose your location/i })).toBeDisabled();
    expect(screen.getByRole("link", { name: /open Google Maps/i })).toHaveAttribute("href", "https://www.google.com/maps/dir/?api=1&destination=6.47%2C3.36");
  });

  it("requests driving directions from the user to the selected station", async () => {
    render(<FuelStationMap apiKey="key" stations={[station]} selectedStationId="station-1" userLocation={{ lat: 6.45, lng: 3.39 }} onSelect={vi.fn()} />);
    await waitFor(() => expect(load).toHaveBeenCalled());
    fireEvent.click(await screen.findByRole("button", { name: /get directions/i }));
    expect(routeMock).toHaveBeenCalledWith(expect.objectContaining({ origin: { lat: 6.45, lng: 3.39 }, destination: { lat: 6.47, lng: 3.36 }, travelMode: "DRIVING" }), expect.any(Function));
  });
});
