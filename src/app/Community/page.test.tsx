import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CommunityPage from "./page";

describe("community feed", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(async (url: string) => {
      if (url === "/api/auth/me") return { ok: true, json: async () => ({ user: { username: "Ada", role: "DRIVER" } }) };
      if (url.startsWith("/api/stations")) return { ok: true, json: async () => ({ stations: [{ _id: "station-1", brand: "Mobil", branchName: "Wilmer", address: "1 Wilmer Road", verified: true }] }) };
      if (url.startsWith("/api/community-posts")) return { ok: true, json: async () => ({ posts: [{ _id: "post-1", category: "LONG_QUEUE", fuelType: null, message: "About twenty cars waiting.", reportedPrice: null, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 60_000).toISOString(), author: { _id: "user-1", username: "Tola" }, station: { _id: "station-1", brand: "Mobil", branchName: "Wilmer", address: "1 Wilmer Road", verified: true }, votes: { accurate: 4, outdated: 1, mine: null } }] }) };
      throw new Error(`Unexpected request: ${url}`);
    }));
  });

  it("uses the hamburger navigation and renders backend station reports", async () => {
    render(<CommunityPage />);
    expect(screen.getByRole("button", { name: "Open navigation menu" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Mobil — Wilmer")).toBeInTheDocument());
    expect(screen.getByText("About twenty cars waiting.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Still accurate 4/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Fuel station")).toBeInTheDocument();
    expect(screen.getByLabelText("Report category")).toBeInTheDocument();
  });
});
