import { describe, expect, it } from "vitest";
import { getCatalogAssetUrl } from "../client/src/data/catalog";

describe("أصول GitHub Pages", () => {
  it("يستخدم رابط التخزين الكامل للصور عند بناء نسخة GitHub Pages", () => {
    expect(
      getCatalogAssetUrl("/manus-storage/example.jpg", true)
    ).toBe(
      "https://autozonshop-ke59zmg5.manus.space/manus-storage/example.jpg"
    );
  });

  it("يحافظ على مسار الصورة المحلي في نسخة المتجر المستضافة", () => {
    expect(getCatalogAssetUrl("/manus-storage/example.jpg", false)).toBe(
      "/manus-storage/example.jpg"
    );
  });
});

