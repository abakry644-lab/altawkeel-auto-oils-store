import { describe, expect, it } from "vitest";
import type { Product } from "@shared/commerce/types";
import { productMatchesCategory, productSearchText } from "./store";

const product: Product = {
  id: "product-1",
  handle: "oil",
  title: "زيت محرك تخليقي",
  description: "خيار مناسب للمحركات الحديثة",
  descriptionHtml: "<p>خيار مناسب للمحركات الحديثة</p>",
  productType: "زيوت المحرك",
  vendor: "أوتو زون",
  tags: ["5W-30", "زيوت المحرك"],
  options: [],
  priceRange: { min: { amount: "185", currencyCode: "EGP" }, max: { amount: "185", currencyCode: "EGP" } },
  images: [],
  variants: [],
};

describe("أدوات كتالوج أوتو زون", () => {
  it("تطابق المنتج مع تصنيفه العربي", () => {
    expect(productMatchesCategory(product, "زيوت المحرك")).toBe(true);
    expect(productMatchesCategory(product, "فلاتر الهواء")).toBe(false);
  });

  it("ينشئ نصًا قابلًا للبحث من كل بيانات المنتج المهمة", () => {
    expect(productSearchText(product)).toContain("تخليقي");
    expect(productSearchText(product)).toContain("5w-30");
  });
});
