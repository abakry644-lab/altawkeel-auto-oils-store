export const WHATSAPP_NUMBER = "201099014725";
export const WHATSAPP_GREETING = "مرحبًا، لدي استفسار عن زيوت وفلاتر السيارات.";

export function createWhatsAppUrl(message: string = WHATSAPP_GREETING) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
