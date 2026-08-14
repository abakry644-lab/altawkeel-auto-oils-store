import { describe, expect, it } from "vitest";
import { WHATSAPP_NUMBER, createWhatsAppUrl } from "../client/src/lib/contact";

describe("رابط التواصل عبر واتساب", () => {
  it("يربط بالرقم المعتمد مع رسالة عربية جاهزة", () => {
    const url = createWhatsAppUrl();

    expect(WHATSAPP_NUMBER).toBe("201099014725");
    expect(url).toContain("https://wa.me/201099014725");
    expect(decodeURIComponent(url)).toContain("مرحبًا، لدي استفسار عن زيوت وفلاتر السيارات.");
  });
});
