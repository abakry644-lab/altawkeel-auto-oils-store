import type { Image, Money } from "@shared/commerce/types";

export type LocalProduct = {
  id: string;
  handle: string;
  title: string;
  category: "زيوت المحرك" | "فلاتر الهواء" | "فلاتر الزيت";
  description: string;
  price: Money;
  image: Image;
  tags: string[];
  available: boolean;
};

export const LOCAL_PRODUCTS: LocalProduct[] = [
  {
    id: "castrol-gtx",
    handle: "castrol-gtx",
    title: "Castrol GTX",
    category: "زيوت المحرك",
    description: "زيت محرك Castrol GTX مناسب للصيانة الدورية. راجع توصيات سيارتك لاختيار اللزوجة والسعة المناسبة قبل الطلب.",
    price: { amount: "500", currencyCode: "EGP" },
    image: { url: "/manus-storage/castrol-gtx_1115e7c7.jpg", altText: "عبوة زيت محرك Castrol GTX" },
    tags: ["زيت محرك", "Castrol", "متوفر للطلب"],
    available: true,
  },
  {
    id: "mobil-super-4t",
    handle: "mobil-super-4t",
    title: "Mobil Super 4T",
    category: "زيوت المحرك",
    description: "زيت Mobil Super 4T للاستخدامات المناسبة للدراجات النارية. راجع دليل المركبة وتواصل معنا عبر واتساب عند الحاجة للمساعدة.",
    price: { amount: "200", currencyCode: "EGP" },
    image: { url: "/manus-storage/mobil-super-4t_9ccaa1d1.jpg", altText: "عبوة زيت Mobil Super 4T" },
    tags: ["زيت محرك", "Mobil", "متوفر للطلب"],
    available: true,
  },
];

export function findLocalProduct(handle: string) {
  return LOCAL_PRODUCTS.find(product => product.handle === handle);
}
