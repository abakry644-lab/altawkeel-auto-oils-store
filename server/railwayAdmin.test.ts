import { afterEach, describe, expect, it } from "vitest";
import { isRailwayAdminPasswordValid } from "./_core/railwayAdmin";

describe("isRailwayAdminPasswordValid", () => {
  const original = process.env.RAILWAY_ADMIN_PASSWORD;

  afterEach(() => {
    if (original === undefined) delete process.env.RAILWAY_ADMIN_PASSWORD;
    else process.env.RAILWAY_ADMIN_PASSWORD = original;
  });

  it("accepts the configured password exactly", () => {
    process.env.RAILWAY_ADMIN_PASSWORD = "Altawkeel2026";
    expect(isRailwayAdminPasswordValid("Altawkeel2026")).toBe(true);
  });

  it("ignores accidental surrounding whitespace and quotes in the environment value", () => {
    process.env.RAILWAY_ADMIN_PASSWORD = '  "Altawkeel2026"  ';
    expect(isRailwayAdminPasswordValid("Altawkeel2026")).toBe(true);
  });

  it("rejects a different password", () => {
    process.env.RAILWAY_ADMIN_PASSWORD = "Altawkeel2026";
    expect(isRailwayAdminPasswordValid("WrongPassword")).toBe(false);
  });
});
