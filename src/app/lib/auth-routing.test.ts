import { describe, expect, it } from "vitest";
import { dashboardForRole, validateLogin, validateSignup } from "./auth-routing";

describe("authentication entry helpers", () => {
  it.each([["DRIVER", "/Dashboard"], ["ADMIN", "/admin"], ["SUPER_ADMIN", "/superadmin"]] as const)("routes %s to %s", (role, path) => {
    expect(dashboardForRole(role)).toBe(path);
  });

  it("requires both login fields", () => {
    expect(validateLogin("", "password")).toBe("Enter your email and password.");
    expect(validateLogin("driver@example.com", "password")).toBeNull();
  });

  it("validates normal-user signup fields and confirmation", () => {
    expect(validateSignup({ username: "driver", email: "bad", password: "password", confirmation: "password" })).toBe("Enter a valid email address.");
    expect(validateSignup({ username: "driver", email: "driver@example.com", password: "short", confirmation: "short" })).toBe("Password must contain at least 8 characters.");
    expect(validateSignup({ username: "driver", email: "driver@example.com", password: "password", confirmation: "different" })).toBe("Passwords do not match.");
    expect(validateSignup({ username: "driver", email: "driver@example.com", password: "password", confirmation: "password" })).toBeNull();
  });
});
