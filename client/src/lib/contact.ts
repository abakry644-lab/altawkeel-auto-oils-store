import type { Cart } from "@shared/commerce/types";
import { formatPrice } from "./store";

export const WHATSAPP_NUMBER = "201099014725";
export const WHATSAPP_GREETING = "مرحبًا، لدي استفسار عن زيوت وفلاتر السيارات.";

export function createWhatsAppUrl(message: string = WHATSAPP_GREETING) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function createCartOrderMessage(cart: Cart) {
  const items = cart.items
    .map((item, index) => {
      const variant = item.variantTitle !== "Default Title" ? ` — ${item.variantTitle}` : "";
      return `${index + 1}. ${item.productTitle}${variant}\nالكمية: ${item.quantity} | الإجمالي: ${formatPrice(item.lineTotal)}`;
    })
    .join("\n\n");

  return `مرحبًا، أرغب في تأكيد الطلب التالي من التوكيل:\n\n${items}\n\nإجمالي الطلب: ${formatPrice(cart.total)}\n\nالاسم:\nرقم الهاتف:\nالعنوان التفصيلي:`;
}
