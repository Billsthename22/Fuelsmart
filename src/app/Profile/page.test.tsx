import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfilePage from "./page";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));

describe("driver settings profile", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ user: { id: "user-1", role: "DRIVER", fullName: "Ada Okafor", username: "ada", email: "ada@example.com", state: "Lagos", city: "Yaba", vehicle: { make: "Toyota", model: "Corolla", year: 2021, fuelType: "PMS", plateNumber: "KJA 123 AB" }, reportsSubmitted: 3 } }) }));
  });

  it("shows saved account details and keeps password inputs hidden until requested", async () => {
    render(<ProfilePage />);
    await waitFor(() => expect(screen.getByText("Ada Okafor")).toBeInTheDocument());
    expect(screen.getByText("@ada")).toBeInTheDocument();
    expect(screen.getByText(/Toyota Corolla/)).toBeInTheDocument();
    expect(screen.queryByLabelText("Current password")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Change password" }));
    expect(screen.getByLabelText("Current password")).toBeInTheDocument();
  });
});
