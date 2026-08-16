import type { Cart } from "@shared/commerce/types";
import { formatPrice } from "./store";

export const WHATSAPP_NUMBER = "201004900814";
export const WHATSAPP_GREETING = "مرحبًا، لدي استفسار عن زيوت وفلاتر السيارات.";

export type CustomerDetails = {
  name: string;
  phone: string;
  address: string;
};

export type CustomerDetailsErrors = Partial<
  Record<keyof CustomerDetails, string>
>;

export function validateCustomerDetails(
  details: CustomerDetails
): CustomerDetailsErrors {
  const errors: CustomerDetailsErrors = {};
  const phoneDigits = details.phone.replace(/\D/g, "");

  if (details.name.trim().length < 3)
    errors.name = "أدخل الاسم الكامل كما سيظهر في الطلب.";
  if (phoneDigits.length < 8 || phoneDigits.length > 15)
    errors.phone = "أدخل رقم هاتف صحيحًا للتواصل.";
  if (details.address.trim().length < 8)
    errors.address = "أدخل عنوان التوصيل بالتفصيل.";

  return errors;
}

export function createWhatsAppUrl(message: string = WHATSAPP_GREETING) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function createCartOrderMessage(cart: Cart, customer: CustomerDetails) {
  const items = cart.items
    .map((item, index) => {
      const variant =
        item.variantTitle !== "Default Title" ? ` — ${item.variantTitle}` : "";
      return `${index + 1}. ${item.productTitle}${variant}\nالكمية: ${item.quantity} | الإجمالي: ${formatPrice(item.lineTotal)}`;
    })
    .join("\n\n");

  return `مرحبًا، أرغب في تأكيد الطلب التالي من التوكيل:\n\n${items}\n\nإجمالي الطلب: ${formatPrice(cart.total)}\n\nبيانات العميل:\nالاسم: ${customer.name.trim()}\nرقم الهاتف: ${customer.phone.trim()}\nالعنوان: ${customer.address.trim()}`;
}

type OrderDispatchActions = {
  openUrl: (url: string) => void;
  clearCart: () => void;
  closeCart: () => void;
};

export function dispatchCartOrderToWhatsApp(
  cart: Cart | null,
  customer: CustomerDetails,
  actions: OrderDispatchActions
) {
  if (!cart?.items.length) return false;
  if (Object.keys(validateCustomerDetails(customer)).length) return false;

  actions.openUrl(createWhatsAppUrl(createCartOrderMessage(cart, customer)));
  actions.clearCart();
  actions.closeCart();
  return true;
}
