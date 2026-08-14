import type { Money, Product } from "@shared/commerce/types";

export const STORE_CATEGORIES = ["الكل", "زيوت المحرك", "فلاتر الهواء", "فلاتر الزيت"] as const;

export function formatPrice(money: Money) {
  const amount = Number(money.amount);
  if (Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function productMatchesCategory(product: Product, category: string) {
  return category === "الكل" || product.productType === category || product.tags.includes(category);
}

export function productSearchText(product: Product) {
  return [product.title, product.description, product.productType, product.vendor, ...product.tags]
    .join(" ")
    .toLocaleLowerCase("ar");
}
