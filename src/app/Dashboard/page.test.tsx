import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "./page";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace, push: vi.fn() }) }));
vi.mock("@googlemaps/js-api-loader", () => ({ Loader: class { load = vi.fn().mockResolvedValue(undefined); } }));

describe("driver dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: {
      getCurrentPosition: vi.fn((success) => success({ coords: { latitude: 6.45, longitude: 3.39 } })),
    } });
    vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string) => url === "/api/auth/me"
      ? { ok: true, json: async () => ({ user: { role: "DRIVER", username: "Ada" } }) }
      : { ok: true, json: async () => ({ stations: [] }) }));
  });

  it("does not show price history or a price-trend preview to drivers", async () => {
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText("Welcome back, Ada")).toBeInTheDocument());
    expect(screen.queryByText("Price History")).not.toBeInTheDocument();
    expect(screen.queryByText("Price trend concept")).not.toBeInTheDocument();
  });

  it("opens and closes the responsive navigation consistently", async () => {
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText("Welcome back, Ada")).toBeInTheDocument());
    const toggle = screen.getByRole("button", { name: "Open navigation menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
    expect(screen.getByTestId("driver-navigation-drawer")).toHaveClass("max-w-[85vw]");
    const stationsLink = screen.getByRole("link", { name: "Stations" });
    stationsLink.addEventListener("click", (event) => event.preventDefault(), { once: true });
    fireEvent.click(stationsLink);
    expect(screen.queryByRole("button", { name: "Close menu" })).not.toBeInTheDocument();
  });
});
