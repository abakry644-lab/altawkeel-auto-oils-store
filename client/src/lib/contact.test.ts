import { describe, expect, it } from "vitest";
import type { Cart } from "@shared/commerce/types";
import { WHATSAPP_NUMBER, createCartOrderMessage, createWhatsAppUrl } from "./contact";

describe("رابط التواصل عبر واتساب", () => {
  it("يربط بالرقم المعتمد مع رسالة عربية جاهزة", () => {
    const url = createWhatsAppUrl();

    expect(WHATSAPP_NUMBER).toBe("201099014725");
    expect(url).toContain("https://wa.me/201099014725");
    expect(decodeURIComponent(url)).toContain("مرحبًا، لدي استفسار عن زيوت وفلاتر السيارات.");
  });

  it("ينشئ رسالة طلب تشمل المنتجات والكميات والإجمالي", () => {
    const cart: Cart = {
      id: "cart-1",
      checkoutUrl: "https://example.test/checkout",
      itemCount: 2,
      subtotal: { amount: "700", currencyCode: "EGP" },
      total: { amount: "700", currencyCode: "EGP" },
      items: [{
        lineId: "line-1",
        variantId: "variant-1",
        productHandle: "castrol-gtx",
        productTitle: "Castrol GTX",
        variantTitle: "Default Title",
        image: null,
        unitPrice: { amount: "350", currencyCode: "EGP" },
        quantity: 2,
        lineTotal: { amount: "700", currencyCode: "EGP" },
      }],
    };

    const message = createCartOrderMessage(cart);

    expect(message).toContain("Castrol GTX");
    expect(message).toContain("الكمية: 2");
    expect(message).toContain("إجمالي الطلب:");
  });
});
