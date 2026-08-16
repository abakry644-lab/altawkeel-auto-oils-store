import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createUserContext(role: "admin" | "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "catalog-test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("صلاحيات إدارة الكتالوج", () => {
  it("يمنع المستخدم العادي من إنشاء منتج", async () => {
    const caller = appRouter.createCaller(createUserContext("user"));

    await expect(
      caller.catalog.create({
        handle: "test-product",
        title: "منتج اختبار",
        category: "زيوت المحرك",
        description: "وصف اختبار صالح لإنشاء المنتج.",
        price: 100,
        imageUrl: "/manus-storage/example.jpg",
        imageAltText: "صورة اختبار",
        tags: ["اختبار"],
        available: true,
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
