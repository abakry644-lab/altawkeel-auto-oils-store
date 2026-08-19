import type { Image, Money } from "./commerce/types";

export type CatalogProduct = {
  id: string;
  handle: string;
  title: string;
  category: string;
  description: string;
  price: Money;
  image: Image;
  tags: string[];
  available: boolean;
};

export const PRODUCT_CATEGORIES = [
  "زيوت المحرك",
  "فلاتر الهواء",
  "فلاتر الزيت",
  "سوائل التبريد",
] as const;

/**
 * Keeps product handles URL-friendly while allowing Arabic product names.
 * Spaces and punctuation become a single hyphen; letters and numbers are kept.
 */
export function normalizeProductHandle(value: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\u0750-\u077F]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}
