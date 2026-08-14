import { describe, expect, it } from "vitest";

describe("Shopify Admin API readiness", () => {
  it("keeps embedded administration disabled until an explicit server-only token is configured", () => {
    const token = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;

    expect(Boolean(token)).toBe(false);
  });
});
