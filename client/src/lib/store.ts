import type { Money } from "@shared/commerce/types";
import type { CatalogProduct } from "@shared/catalog";

export const STORE_CATEGORIES = [
  "الكل",
  "زيوت المحرك",
  "فلاتر الهواء",
  "فلاتر الزيت",
  "سوائل التبريد",
] as const;

export function formatPrice(money: Money) {
  const amount = Number(money.amount);
  if (Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function productMatchesCategory(
  product: CatalogProduct,
  category: string
) {
  return category === "الكل" || product.category === category;
}

export function productSearchText(product: CatalogProduct) {
  return [product.title, product.description, product.category, ...product.tags]
    .join(" ")
    .toLocaleLowerCase("ar");
}
