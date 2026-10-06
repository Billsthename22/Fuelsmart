import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StationSummary } from "@/app/lib/stations";
import NearbyStationList from "./NearbyStationList";
import LocationAccessPanel from "./LocationAccessPanel";
import DashboardDemoWidgets from "./DashboardDemoWidgets";

const baseStation: StationSummary = {
  _id: "station-1",
  brand: "Mobil",
  branchName: "Wilmer",
  state: "Lagos",
  address: "1 Wilmer Road, Lagos",
  coordinates: { lat: 6.47, lng: 3.36 },
  status: "OPEN",
  verified: true,
  distanceKm: 2.45,
  lastUpdatedAt: "2026-10-06T09:00:00.000Z",
  currentPrices: [{ fuelType: "PMS", price: 950, available: false, updatedAt: "2026-10-06T09:00:00.000Z" }],
};

describe("NearbyStationList", () => {
  it("shows the loading state", () => {
    render(<NearbyStationList state="loading" stations={[]} onRetry={vi.fn()} userLocation={null} />);
    expect(screen.getByText(/finding verified stations/i)).toBeInTheDocument();
  });

  it("shows a retryable API error", () => {
    const retry = vi.fn();
    render(<NearbyStationList state="error" stations={[]} onRetry={retry} userLocation={null} />);
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("guides the user to increase the radius when no station is found", () => {
    render(<NearbyStationList state="ready" stations={[]} onRetry={vi.fn()} userLocation={{ lat: 6.45, lng: 3.39 }} />);
    expect(screen.getByText(/increase the search radius/i)).toBeInTheDocument();
  });

  it("renders real station status, price availability, distance and map link", () => {
    render(<NearbyStationList state="ready" stations={[baseStation]} onRetry={vi.fn()} userLocation={{ lat: 6.45, lng: 3.39 }} radiusKm={15} />);
    expect(screen.getByText("Station open")).toBeInTheDocument();
    expect(screen.getByText("Fuel unavailable")).toBeInTheDocument();
    expect(screen.getByText("2.45 km away")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view map/i })).toHaveAttribute("href", expect.stringContaining("stationId=station-1"));
    expect(screen.getByRole("link", { name: /view map/i })).toHaveAttribute("href", expect.stringContaining("radiusKm=15"));
  });

  it("keeps closed stations visible and labels stations without prices", () => {
    render(<NearbyStationList state="ready" stations={[{ ...baseStation, status: "CLOSED", currentPrices: [] }]} onRetry={vi.fn()} userLocation={null} />);
    expect(screen.getByText("Station closed")).toBeInTheDocument();
    expect(screen.getByText("No prices reported")).toBeInTheDocument();
  });
});

describe("dashboard fallback and demo boundaries", () => {
  it("keeps retry and manual address search available after location denial", () => {
    const retry = vi.fn();
    render(<LocationAccessPanel denied onRetry={retry} />);
    expect(screen.getByRole("textbox", { name: /search an address/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /retry location/i }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("keeps the product concepts visible as preview data", () => {
    render(<DashboardDemoWidgets />);
    expect(screen.getByText(/preview data/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Smart Buy/i)).toBeInTheDocument();
    expect(screen.getByText(/Reward Pts/i)).toBeInTheDocument();
  });
});
