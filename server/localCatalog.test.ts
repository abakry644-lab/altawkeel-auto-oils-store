import { describe, expect, it } from "vitest";
import { LOCAL_PRODUCTS, findLocalProduct } from "../client/src/data/catalog";

describe("الكتالوج المحلي", () => {
  it("يحتوي على منتجات قابلة للعرض وبأسعار وصور صالحة", () => {
    expect(LOCAL_PRODUCTS.length).toBeGreaterThan(0);
    expect(
      LOCAL_PRODUCTS.every(
        product =>
          product.price.amount !== "0" &&
          product.image.url.startsWith("/manus-storage/")
      )
    ).toBe(true);
  });

  it("يعثر على المنتج من المعرّف اليدوي", () => {
    expect(findLocalProduct("castrol-gtx")?.title).toBe("Castrol GTX");
  });

  it("يعرض كولانت كالتكس ضمن سوائل التبريد بالسعر المحدد", () => {
    const coolant = findLocalProduct("caltex-delo-xlc-coolant-5l");

    expect(coolant).toMatchObject({
      category: "سوائل التبريد",
      price: { amount: "350", currencyCode: "EGP" },
      available: true,
    });
  });
});
