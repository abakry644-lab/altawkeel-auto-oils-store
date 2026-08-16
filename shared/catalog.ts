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
