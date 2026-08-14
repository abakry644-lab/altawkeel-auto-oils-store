import { describe, expect, it } from "vitest";

describe("اسم التطبيق", () => {
  it("يعكس هوية التوكيل في إعدادات البيئة", () => {
    expect(process.env.VITE_APP_TITLE).toBe("التوكيل | زيوت وفلاتر السيارات");
  });
});
