import { describe, expect, it } from "vitest";
import type { Cart } from "../shared/commerce/types";
import {
  WHATSAPP_NUMBER,
  createCartOrderMessage,
  createWhatsAppUrl,
  dispatchCartOrderToWhatsApp,
  validateCustomerDetails,
} from "../client/src/lib/contact";

describe("رابط التواصل عبر واتساب", () => {
  it("يربط بالرقم المعتمد مع رسالة عربية جاهزة", () => {
    const url = createWhatsAppUrl();

    expect(WHATSAPP_NUMBER).toBe("201099014725");
    expect(url).toContain("https://wa.me/201099014725");
    expect(decodeURIComponent(url)).toContain(
      "مرحبًا، لدي استفسار عن زيوت وفلاتر السيارات."
    );
  });

  it("ينشئ رسالة طلب تتضمن المنتجات والكميات والإجمالي", () => {
    const cart: Cart = {
      id: "cart-1",
      checkoutUrl: "https://example.test/checkout",
      itemCount: 2,
      subtotal: { amount: "700", currencyCode: "EGP" },
      total: { amount: "700", currencyCode: "EGP" },
      items: [
        {
          lineId: "line-1",
          variantId: "variant-1",
          productHandle: "castrol-gtx",
          productTitle: "Castrol GTX",
          variantTitle: "Default Title",
          image: null,
          unitPrice: { amount: "350", currencyCode: "EGP" },
          quantity: 2,
          lineTotal: { amount: "700", currencyCode: "EGP" },
        },
      ],
    };

    const message = createCartOrderMessage(cart, {
      name: "أحمد بكري",
      phone: "201099014725",
      address: "القاهرة، مدينة نصر",
    });

    expect(message).toContain("Castrol GTX");
    expect(message).toContain("الكمية: 2");
    expect(message).toContain("إجمالي الطلب:");
    expect(message).toContain("أحمد بكري");
  });

  it("يتحقق من الاسم والهاتف والعنوان قبل إرسال الطلب", () => {
    expect(
      validateCustomerDetails({ name: "أ", phone: "12", address: "شارع" })
    ).toEqual({
      name: "أدخل الاسم الكامل كما سيظهر في الطلب.",
      phone: "أدخل رقم هاتف صحيحًا للتواصل.",
      address: "أدخل عنوان التوصيل بالتفصيل.",
    });
    expect(
      validateCustomerDetails({
        name: "أحمد بكري",
        phone: "201099014725",
        address: "القاهرة، مدينة نصر",
      })
    ).toEqual({});
  });

  it("يفتح رسالة واتساب ثم يفرغ السلة ويغلقها بالترتيب", () => {
    const cart: Cart = {
      id: "cart-2",
      checkoutUrl: "https://example.test/checkout",
      itemCount: 1,
      subtotal: { amount: "500", currencyCode: "EGP" },
      total: { amount: "500", currencyCode: "EGP" },
      items: [
        {
          lineId: "line-2",
          variantId: "variant-2",
          productHandle: "mobil-super-4t",
          productTitle: "Mobil super 4T",
          variantTitle: "Default Title",
          image: null,
          unitPrice: { amount: "500", currencyCode: "EGP" },
          quantity: 1,
          lineTotal: { amount: "500", currencyCode: "EGP" },
        },
      ],
    };
    const calls: string[] = [];

    const dispatched = dispatchCartOrderToWhatsApp(
      cart,
      {
        name: "أحمد بكري",
        phone: "201099014725",
        address: "القاهرة، مدينة نصر",
      },
      {
        openUrl: url => calls.push(`open:${url}`),
        clearCart: () => calls.push("clear"),
        closeCart: () => calls.push("close"),
      }
    );

    expect(dispatched).toBe(true);
    expect(calls[0]).toContain("https://wa.me/201099014725");
    expect(calls.slice(1)).toEqual(["clear", "close"]);
  });
});
