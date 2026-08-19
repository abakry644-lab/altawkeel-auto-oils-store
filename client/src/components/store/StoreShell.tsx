import { useCart } from "@/contexts/CartContext";
import { Link } from "wouter";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import BrandLogo from "./BrandLogo";
import CartDrawer from "./CartDrawer";
import WhatsAppButton from "./WhatsAppButton";

export default function StoreShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const navItems = [
    { href: "/", label: "الرئيسية" },
    { href: "/shop", label: "المنتجات" },
    { href: "/#offers", label: "العروض" },
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[var(--brand-canvas)] text-[var(--brand-ink)]"
      dir="rtl"
    >
      <header className="sticky top-0 z-40 border-b border-[var(--brand-border)] bg-[var(--brand-canvas)]/90 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between gap-5">
          <Link
            href="/"
            className="group flex shrink-0 items-center"
            aria-label="العودة للرئيسية — التوكيل"
          >
            <BrandLogo />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-bold text-[var(--brand-muted)] lg:flex">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-[var(--brand-gold)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              className="relative inline-flex h-11 items-center gap-2 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-panel)] px-3.5 text-sm font-extrabold text-[var(--brand-deep)] transition hover:border-[var(--brand-gold)] hover:bg-[var(--brand-soft)] active:scale-[.97]"
              aria-label="فتح سلة التسوق"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">السلة</span>
              {itemCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--brand-gold)] px-1 text-[11px] text-[var(--brand-deep)]">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(open => !open)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--brand-border)] bg-[var(--brand-panel)] text-[var(--brand-deep)] lg:hidden"
              aria-label="فتح قائمة التنقل"
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="border-t border-[var(--brand-border)] bg-[var(--brand-canvas)] px-5 py-4 lg:hidden">
            <div className="container grid gap-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-bold text-[var(--brand-forest)] hover:bg-[var(--brand-soft)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-20 bg-[var(--brand-deep)] text-[var(--brand-gold-light)]">
        <div className="container grid gap-10 py-12 md:grid-cols-[1.25fr_.8fr_.8fr]">
          <div>
            <div className="mb-4"><BrandLogo dark /></div>
            <p className="max-w-sm text-sm leading-7 text-white/75">
              وجهتك العملية لاختيار زيوت المحرك والفلاتر الأساسية بثقة ووضوح.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-extrabold text-[var(--brand-gold-light)]">
              التصنيفات
            </h3>
            <div className="grid gap-2 text-sm text-white/75">
              <Link href="/shop?category=زيوت%20المحرك">زيوت المحرك</Link>
              <Link href="/shop?category=فلاتر%20الهواء">فلاتر الهواء</Link>
              <Link href="/shop?category=فلاتر%20الزيت">فلاتر الزيت</Link>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-extrabold text-[var(--brand-gold-light)]">
              خدمة العملاء
            </h3>
            <p className="text-sm leading-7 text-white/75">
              أضف المنتجات إلى السلة ثم أرسل تفاصيل طلبك وبيانات التوصيل عبر
              واتساب.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-white/55">
          <p>© {new Date().getFullYear()} التوكيل — زيوت وفلاتر السيارات</p>
          <p className="mt-1.5 text-[11px] font-medium text-[var(--brand-gold-light)]">
            صُمّم بواسطة{" "}
            <a
              href="https://ahmed-bakry-portfolio-live.vercel.app/#contact"
              target="_blank"
              rel="noreferrer"
              dir="ltr"
              className="font-bold tracking-wide text-[var(--brand-gold-light)] underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-deep)]"
            >
              Ahmed Bakry
            </a>
          </p>
        </div>
      </footer>
      <WhatsAppButton />
      <CartDrawer />
    </div>
  );
}
