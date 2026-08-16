import ProductCard from "@/components/store/ProductCard";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import {
  STORE_CATEGORIES,
  productMatchesCategory,
  productSearchText,
} from "@/lib/store";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

function startingCategory() {
  const value = new URLSearchParams(window.location.search).get("category");
  return STORE_CATEGORIES.includes(value as (typeof STORE_CATEGORIES)[number])
    ? value!
    : "الكل";
}

export default function Shop() {
  const { products } = useCatalogProducts();
  const [location] = useLocation();
  const [category, setCategory] = useState(startingCategory);
  const [term, setTerm] = useState("");
  const currentCategory = useMemo(
    () => new URLSearchParams(location.split("?")[1] ?? "").get("category"),
    [location]
  );
  const selectedCategory =
    currentCategory &&
    STORE_CATEGORIES.includes(
      currentCategory as (typeof STORE_CATEGORIES)[number]
    )
      ? currentCategory
      : category;
  const results = useMemo(
    () =>
      products.filter(product =>
        productMatchesCategory(product, selectedCategory)
      ).filter(product =>
        productSearchText(product).includes(term.toLocaleLowerCase("ar"))
      ),
    [products, selectedCategory, term]
  );

  return (
    <div className="container py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-extrabold tracking-[.16em] text-[#af762d]">
          كتالوج متجدد
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#173b33] sm:text-5xl">
          المنتجات
        </h1>
        <p className="mt-4 text-base leading-8 text-[#66766f]">
          ابحث واختر من زيوت المحرك وفلاتر الهواء وفلاتر الزيت. ستظهر تفاصيل كل
          منتج وسعره قبل إضافته للسلة.
        </p>
      </div>
      <div className="mt-10 grid gap-4 rounded-3xl border border-[#e6dfd4] bg-white p-4 shadow-[0_10px_28px_rgba(20,51,43,.04)] lg:grid-cols-[1fr_auto]">
        <label className="flex h-12 items-center gap-3 rounded-2xl bg-[#f3f1eb] px-4 text-[#718079]">
          <Search size={19} />
          <input
            value={term}
            onChange={event => setTerm(event.target.value)}
            placeholder="ابحث باسم المنتج أو اللزوجة..."
            className="w-full bg-transparent text-sm font-medium text-[#25483e] outline-none placeholder:text-[#8b9690]"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={18} className="mr-1 text-[#789087]" />
          {STORE_CATEGORIES.map(item => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition ${selectedCategory === item ? "bg-[#163d36] text-white" : "bg-[#f5f2ec] text-[#52665d] hover:bg-[#ebe6dc]"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm font-bold text-[#697872]">
          {results.length} منتج متاح
        </p>
      </div>
      {results.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-[#d9d0c1] bg-[#fffdf9] px-6 py-16 text-center">
          <h2 className="text-xl font-extrabold text-[#23463c]">
            لا توجد نتائج مطابقة الآن
          </h2>
          <p className="mt-2 text-sm text-[#718079]">
            جرّب كلمة بحث أخرى أو اختر تصنيفًا مختلفًا.
          </p>
        </div>
      )}
    </div>
  );
}
