import ProductCard from "@/components/store/ProductCard";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import {
  ArrowLeft,
  CheckCircle2,
  Droplets,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { products } = useCatalogProducts();
  const categories = [
    [
      "زيوت المحرك",
      "أداء سلس وحماية مدروسة للمحرك.",
      Droplets,
      "/shop?category=زيوت%20المحرك",
    ],
    [
      "فلاتر الهواء",
      "تنقية موثوقة للهواء الداخل للمحرك.",
      SlidersHorizontal,
      "/shop?category=فلاتر%20الهواء",
    ],
    [
      "فلاتر الزيت",
      "لصيانة منتظمة واهتمام أدق بالتفاصيل.",
      ShieldCheck,
      "/shop?category=فلاتر%20الزيت",
    ],
    [
      "سوائل التبريد",
      "حماية مدروسة لنظام تبريد سيارتك.",
      Snowflake,
      "/shop?category=سوائل%20التبريد",
    ],
  ] as const;
  const promises = [
    [CheckCircle2, "تفاصيل واضحة", "تعرف على نوع المنتج وسعره قبل إضافته."],
    [Truck, "توصيل منظم", "أضف عنوان التوصيل مباشرة داخل رسالة الطلب."],
    [ShieldCheck, "طلب عبر واتساب", "راجع الإجمالي ثم أرسل الطلب عبر واتساب."],
  ] as const;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#e9e3d9] bg-[#f3f0e9]">
        <div className="hero-aurora hero-aurora--gold absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#d8b274]/25 blur-3xl" />
        <div className="hero-aurora hero-aurora--green absolute -bottom-36 left-[10%] h-80 w-80 rounded-full bg-[#2c6153]/15 blur-3xl" />
        <div aria-hidden="true" className="hero-tech-grid" />
        <div aria-hidden="true" className="hero-gauge-motif" />
        <div aria-hidden="true" className="hero-road-lines" />
        <div className="container relative flex min-h-[460px] items-center justify-center py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="brand-pill inline-flex items-center gap-2 rounded-full border border-[#dcccae] bg-[#fffaf0] px-3 py-1.5 text-xs font-extrabold text-[#9f6c27]">
              <Sparkles size={14} /> معيار التوكيل لسيارتك
            </div>
            <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.22] tracking-tight text-[#173b33] sm:text-5xl lg:text-6xl">
              زيوت وفلاتر
              <br />
              <span className="text-[#b4772c]">بمعيار أعلى</span> لكل رحلة.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#60716a]">
              واجهة سهلة لاختيار زيوت المحرك والفلاتر الأساسية، مع تفاصيل واضحة
              وسلة عملية لإتمام طلبك عبر واتساب.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-[#163d36] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(22,61,54,.18)] transition hover:bg-[#285c50] active:scale-[.97]"
              >
                تسوّق المنتجات <ArrowLeft size={18} />
              </Link>
              <Link
                href="/shop?category=زيوت%20المحرك"
                className="inline-flex items-center gap-2 rounded-xl border border-[#d6cbbc] bg-white/80 px-5 py-3.5 text-sm font-extrabold text-[#25483e] transition hover:bg-white"
              >
                استكشف الزيوت
              </Link>
            </div>
            <div className="mx-auto mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-[#ddd6cc] pt-6">
              <div>
                <strong className="block text-xl font-extrabold text-[#173b33]">
                  01
                </strong>
                <span className="mt-1 block text-xs font-bold text-[#79857f]">
                  اختيار واضح
                </span>
              </div>
              <div>
                <strong className="block text-xl font-extrabold text-[#173b33]">
                  02
                </strong>
                <span className="mt-1 block text-xs font-bold text-[#79857f]">
                  سلة عملية
                </span>
              </div>
              <div>
                <strong className="block text-xl font-extrabold text-[#173b33]">
                  03
                </strong>
                <span className="mt-1 block text-xs font-bold text-[#79857f]">
                  طلب واتساب
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-extrabold tracking-[.15em] text-[#ad752c]">
              تسوق حسب الحاجة
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#173b33]">
              تصنيفات أساسية
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-extrabold text-[#b4772c]"
          >
            عرض الكل <ArrowLeft size={16} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map(([title, description, Icon, href]) => (
            <Link
              key={title}
              href={href}
              className="group rounded-3xl border border-[#e7e1d8] bg-white p-6 transition hover:-translate-y-1 hover:border-[#c9a56b] hover:shadow-[0_15px_30px_rgba(24,60,52,.08)]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f3eee5] text-[#af762d]">
                <Icon size={23} />
              </span>
              <h3 className="mt-5 text-xl font-extrabold text-[#214238]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#6f7d77]">
                {description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-[#b4772c]">
                استكشف التصنيف <ArrowLeft size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section
        id="offers"
        className="offer-band relative overflow-hidden bg-[#163d36] py-14 text-white sm:py-16"
      >
        <div className="container relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-extrabold tracking-[.15em] text-[#e6b970]">
              التوكيل بجانبك
            </p>
            <h2 className="mt-2 text-3xl font-extrabold">
              اختيار مناسب لكل احتياجات سيارتك.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#c8d3cf]">
              تسوّق زيوت المحرك والفلاتر بثقة، وراجع تفاصيل المنتج قبل إضافة
              طلبك إلى السلة.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d9a553] px-5 py-3.5 text-sm font-extrabold text-[#173b33] transition hover:bg-[#ecc57e]"
          >
            تسوّق الآن <ArrowLeft size={18} />
          </Link>
        </div>
      </section>
      <section className="container py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-extrabold tracking-[.15em] text-[#ad752c]">
              منتجات مختارة
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#173b33]">
              ابدأ من هنا
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-extrabold text-[#b4772c]"
          >
            كل المنتجات <ArrowLeft size={16} />
          </Link>
        </div>
        {products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#d9d0c1] bg-[#fffdf9] p-10 text-center text-sm text-[#718079]">
            أضف منتجك الأول من لوحة الإدارة لبدء العرض.
          </div>
        )}
      </section>
      <section className="border-y border-[#e8e2d8] bg-[#f5f2eb]">
        <div className="container grid gap-7 py-12 md:grid-cols-3">
          {promises.map(([Icon, title, text]) => (
            <div key={title} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[#b4772c] shadow-sm">
                <Icon size={21} />
              </span>
              <div>
                <h3 className="font-extrabold text-[#25463d]">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-[#6e7c75]">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
