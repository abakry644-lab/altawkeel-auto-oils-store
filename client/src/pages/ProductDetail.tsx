import ProductCard from "@/components/store/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { LOCAL_PRODUCTS, findLocalProduct } from "@/data/catalog";
import { formatPrice } from "@/lib/store";
import {
  ArrowRight,
  Check,
  MessageCircle,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Link } from "wouter";

export default function ProductDetail({ handle }: { handle: string }) {
  const { addItem, loading } = useCart();
  const product = findLocalProduct(handle);
  if (!product)
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-extrabold text-[#183e34]">
          لم نعثر على هذا المنتج
        </h1>
        <Link
          href="/shop"
          className="mt-5 inline-flex rounded-xl bg-[#163d36] px-5 py-3 text-sm font-bold text-white"
        >
          العودة للمنتجات
        </Link>
      </div>
    );
  const related = LOCAL_PRODUCTS.filter(
    item => item.handle !== product.handle && item.category === product.category
  ).slice(0, 3);
  return (
    <div className="container py-8 sm:py-12">
      <Link
        href="/shop"
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#60736a] hover:text-[#ad752c]"
      >
        <ArrowRight size={17} /> العودة للمنتجات
      </Link>
      <section className="grid overflow-hidden rounded-[2rem] border border-[#e8e2d8] bg-white lg:grid-cols-2">
        <div className="min-h-[340px] bg-[#f1eee8] p-7 sm:p-12">
          <img
            src={product.image.url}
            alt={product.image.altText ?? product.title}
            className="h-full min-h-[310px] w-full object-contain"
          />
        </div>
        <div className="p-7 sm:p-11">
          <p className="text-xs font-extrabold tracking-[.12em] text-[#ad752c]">
            {product.category}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#173b33] sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-5 whitespace-pre-line text-sm leading-8 text-[#66766f]">
            {product.description}
          </p>
          <div className="my-7 border-y border-[#eee8df] py-5">
            <p className="text-3xl font-extrabold text-[#173b33]">
              {formatPrice(product.price)}
            </p>
            <p className="mt-2 text-xs font-semibold text-[#517061]">
              متوفر للطلب عبر واتساب
            </p>
          </div>
          <button
            disabled={!product.available || loading}
            onClick={() => addItem(product.id, 1)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#bf8332] px-5 py-4 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(191,131,50,.22)] transition hover:bg-[#a87028] active:scale-[.97] disabled:opacity-50"
          >
            <ShoppingBag size={18} />{" "}
            {product.available ? "أضف إلى السلة" : "غير متاح حاليًا"}
          </button>
          <div className="mt-6 grid gap-3 text-xs font-bold text-[#60736a]">
            <p className="flex items-center gap-2">
              <MessageCircle size={17} className="text-[#398064]" /> أرسل تفاصيل
              طلبك مباشرةً عبر واتساب.
            </p>
            <p className="flex items-center gap-2">
              <Truck size={17} className="text-[#398064]" /> أضف بيانات التوصيل
              إلى رسالة الطلب.
            </p>
          </div>
          {product.tags.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-lg bg-[#f3f0e9] px-2.5 py-1.5 text-[11px] font-bold text-[#5a7066]"
                >
                  <Check size={12} className="ml-1 inline" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-xs font-extrabold tracking-[.14em] text-[#ad752c]">
              قد يهمك أيضًا
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#173b33]">
              من التصنيف نفسه
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map(item => (
              <ProductCard product={item} key={item.id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
