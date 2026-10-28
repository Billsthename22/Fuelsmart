import { describe, expect, it } from "vitest";
import { hashDeactivationCode, isValidDeactivationCode } from "./deactivation-otp";

describe("deactivation OTP", () => {
  it("accepts exactly six digits", () => {
    expect(isValidDeactivationCode("123456")).toBe(true);
    expect(isValidDeactivationCode("12345")).toBe(false);
    expect(isValidDeactivationCode("12345a")).toBe(false);
  });

  it("hashes the same code consistently without preserving the plain code", () => {
    expect(hashDeactivationCode("123456")).toBe(hashDeactivationCode("123456"));
    expect(hashDeactivationCode("123456")).not.toBe("123456");
  });
});
