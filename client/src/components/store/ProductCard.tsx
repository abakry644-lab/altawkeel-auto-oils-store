import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/store";
import type { LocalProduct } from "@/data/catalog";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

export default function ProductCard({ product }: { product: LocalProduct }) {
  const { addItem, loading } = useCart();

  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-[#e9e4dc] bg-white shadow-[0_12px_28px_rgba(20,51,43,.045)] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(.23,1,.32,1)] hover:-translate-y-2 hover:border-[#d8b77c] hover:shadow-[0_22px_44px_rgba(20,51,43,.14)] motion-reduce:transform-none motion-reduce:transition-none">
      <Link
        href={`/products/${product.handle}`}
        className="relative block overflow-hidden bg-[#f1eee8]"
      >
        <img
          src={product.image.url}
          alt={product.image.altText ?? product.title}
          className="aspect-square w-full object-cover transition-transform duration-500 ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-[1.075] motion-reduce:transform-none motion-reduce:transition-none"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#163d36]/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        />
      </Link>
      <div className="p-5">
        <p className="mb-2 text-[11px] font-extrabold tracking-wide text-[#a6712e] transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
          {product.category}
        </p>
        <Link
          href={`/products/${product.handle}`}
          className="line-clamp-2 min-h-12 text-base font-extrabold leading-6 text-[#183c34] transition-colors duration-300 hover:text-[#b87727] group-hover:text-[#b87727] motion-reduce:transition-none"
        >
          {product.title}
        </Link>
        <div className="mt-4 flex items-end justify-between gap-3">
          <strong className="text-lg font-extrabold text-[#163d36]">
            {formatPrice(product.price)}
          </strong>
          <button
            disabled={!product.available || loading}
            onClick={() => addItem(product.id, 1)}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#163d36] px-3 text-xs font-extrabold text-white shadow-sm transition-[transform,background-color,box-shadow] duration-200 hover:bg-[#285c50] group-hover:-translate-y-0.5 group-hover:shadow-md active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none"
          >
            <ShoppingBag size={15} /> أضف
          </button>
        </div>
        <Link
          href={`/products/${product.handle}`}
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#6e7c75] transition-colors duration-300 hover:text-[#b87727] group-hover:text-[#b87727] motion-reduce:transition-none"
        >
          عرض التفاصيل
          <ArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" size={14} />
        </Link>
      </div>
    </article>
  );
}
