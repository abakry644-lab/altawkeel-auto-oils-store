import type { Image, Money } from "@shared/commerce/types";

const MANUS_ASSET_ORIGIN = "https://autozonshop-ke59zmg5.manus.space";

export function getCatalogAssetUrl(
  path: string,
  isGitHubPages = import.meta.env.VITE_GITHUB_PAGES === "true"
) {
  return isGitHubPages ? `${MANUS_ASSET_ORIGIN}${path}` : path;
}

export type LocalProduct = {
  id: string;
  handle: string;
  title: string;
  category:
    | "زيوت المحرك"
    | "فلاتر الهواء"
    | "فلاتر الزيت"
    | "سوائل التبريد";
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
    description:
      "زيت محرك Castrol GTX مناسب للصيانة الدورية. راجع توصيات سيارتك لاختيار اللزوجة والسعة المناسبة قبل الطلب.",
    price: { amount: "500", currencyCode: "EGP" },
    image: {
      url: getCatalogAssetUrl("/manus-storage/castrol-gtx_1115e7c7.jpg"),
      altText: "عبوة زيت محرك Castrol GTX",
    },
    tags: ["زيت محرك", "Castrol", "متوفر للطلب"],
    available: true,
  },
  {
    id: "mobil-super-4t",
    handle: "mobil-super-4t",
    title: "Mobil Super 4T",
    category: "زيوت المحرك",
    description:
      "زيت Mobil Super 4T للاستخدامات المناسبة للدراجات النارية. راجع دليل المركبة وتواصل معنا عبر واتساب عند الحاجة للمساعدة.",
    price: { amount: "200", currencyCode: "EGP" },
    image: {
      url: getCatalogAssetUrl("/manus-storage/mobil-super-4t_9ccaa1d1.jpg"),
      altText: "عبوة زيت Mobil Super 4T",
    },
    tags: ["زيت محرك", "Mobil", "متوفر للطلب"],
    available: true,
  },
  {
    id: "caltex-delo-xlc-coolant-5l",
    handle: "caltex-delo-xlc-coolant-5l",
    title: "كولانت كالتكس Delo XLC — 5 لتر",
    category: "سوائل التبريد",
    description:
      "ماء رادياتير كولانت بتركيز 50% وسعة 5 لترات، لحماية فائقة لأنظمة التبريد. المنتج من شركة كالتكس (النجمة)، ومناسب للاستخدام في الرادياتير وفق توصيات السيارة.",
    price: { amount: "350", currencyCode: "EGP" },
    image: {
      url: getCatalogAssetUrl(
        "/manus-storage/caltex-delo-xlc-coolant-5l_86948463.jpg"
      ),
      altText: "عبوة كولانت كالتكس Delo XLC سعة 5 لتر",
    },
    tags: ["كولانت", "ماء رادياتير", "تركيز 50%", "5 لتر", "كالتكس"],
    available: true,
  },
];

export function findLocalProduct(handle: string) {
  return LOCAL_PRODUCTS.find(product => product.handle === handle);
}
