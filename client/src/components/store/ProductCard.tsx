import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/store";
import type { Product } from "@shared/commerce/types";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, loading } = useCart();
  const variant = product.variants[0];
  const image = product.images[0]?.url ?? "/manus-storage/engine-oil-premium_be3b91a4.png";

  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-[#e9e4dc] bg-white shadow-[0_12px_28px_rgba(20,51,43,.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(20,51,43,.11)]">
      <Link href={`/products/${product.handle}`} className="block overflow-hidden bg-[#f1eee8]"><img src={image} alt={product.title} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" /></Link>
      <div className="p-5"><p className="mb-2 text-[11px] font-extrabold tracking-wide text-[#a6712e]">{product.productType || "قطع غيار"}</p><Link href={`/products/${product.handle}`} className="line-clamp-2 min-h-12 text-base font-extrabold leading-6 text-[#183c34] transition-colors hover:text-[#b87727]">{product.title}</Link><div className="mt-4 flex items-end justify-between gap-3"><strong className="text-lg font-extrabold text-[#163d36]">{formatPrice(product.priceRange.min)}</strong><button disabled={!variant?.availableForSale || loading} onClick={() => variant && addItem(variant.id, 1)} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#163d36] px-3 text-xs font-extrabold text-white transition hover:bg-[#285c50] active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-50"><ShoppingBag size={15} /> أضف</button></div><Link href={`/products/${product.handle}`} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#6e7c75] hover:text-[#b87727]">عرض التفاصيل <ArrowLeft size={14} /></Link></div>
    </article>
  );
}
