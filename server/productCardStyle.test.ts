import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const productCardSource = readFileSync(
  new URL("../client/src/components/store/ProductCard.tsx", import.meta.url),
  "utf8"
);

describe("تفاعل بطاقة المنتج", () => {
  it("يضم تأثيرات تمرير مرئية مع بديل لتقليل الحركة", () => {
    expect(productCardSource).toContain("hover:-translate-y-2");
    expect(productCardSource).toContain("group-hover:scale-[1.075]");
    expect(productCardSource).toContain("group-hover:opacity-100");
    expect(productCardSource).toContain("motion-reduce:transition-none");
    expect(productCardSource).toContain("touch-manipulation");
    expect(productCardSource).toContain("group-active:scale-[1.035]");
    expect(productCardSource).toContain("h-11 min-w-11");
  });
});
