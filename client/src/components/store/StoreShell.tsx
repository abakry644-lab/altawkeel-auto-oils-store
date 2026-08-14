import { useCart } from "@/contexts/CartContext";
import { Link } from "wouter";
import { Menu, ShoppingBag, Sparkles, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import CartDrawer from "./CartDrawer";

export default function StoreShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const navItems = [
    { href: "/", label: "الرئيسية" },
    { href: "/shop", label: "المنتجات" },
    { href: "/#offers", label: "العروض" },
    { href: "/admin", label: "الإدارة" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fbfaf7] text-[#1c2421]" dir="rtl">
      <div className="border-b border-[#e9e3d9] bg-[#163d36] px-5 py-2.5 text-center text-xs font-medium text-[#f8f4eb] sm:text-sm">
        شحن مجاني للطلبات التي تتجاوز 500 جنيه — اختر ما يناسب سيارتك بثقة
      </div>
      <header className="sticky top-0 z-40 border-b border-[#ebe6de]/90 bg-[#fbfaf7]/90 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between gap-5">
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="العودة للرئيسية">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#163d36] text-[#d9a553] shadow-[0_10px_24px_rgba(22,61,54,.2)] transition-transform duration-200 group-hover:-rotate-6">
              <Sparkles size={21} strokeWidth={2.2} />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight text-[#163d36]">أوتو زون</span>
              <span className="block text-[10px] font-bold tracking-[.16em] text-[#957d5e]">زيوت وفلاتر</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-bold text-[#56635d] lg:flex">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-[#bf8332]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              className="relative inline-flex h-11 items-center gap-2 rounded-xl border border-[#dfd6c9] bg-white px-3.5 text-sm font-extrabold text-[#163d36] transition hover:border-[#c89143] hover:bg-[#fffaf0] active:scale-[.97]"
              aria-label="فتح سلة التسوق"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">السلة</span>
              {itemCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#bf8332] px-1 text-[11px] text-white">{itemCount}</span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(open => !open)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-[#dfd6c9] bg-white text-[#163d36] lg:hidden"
              aria-label="فتح قائمة التنقل"
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="border-t border-[#ebe6de] bg-[#fbfaf7] px-5 py-4 lg:hidden">
            <div className="container grid gap-1">
              {navItems.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-[#31534a] hover:bg-[#f0eee8]">
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-20 bg-[#163d36] text-[#e9e7df]">
        <div className="container grid gap-10 py-12 md:grid-cols-[1.25fr_.8fr_.8fr]">
          <div>
            <div className="mb-3 text-2xl font-extrabold text-white">أوتو زون</div>
            <p className="max-w-sm text-sm leading-7 text-[#c8d3cf]">وجهتك العملية لاختيار زيوت المحرك والفلاتر الأساسية بثقة ووضوح.</p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-extrabold text-[#d9a553]">التصنيفات</h3>
            <div className="grid gap-2 text-sm text-[#c8d3cf]"><Link href="/shop?category=زيوت%20المحرك">زيوت المحرك</Link><Link href="/shop?category=فلاتر%20الهواء">فلاتر الهواء</Link><Link href="/shop?category=فلاتر%20الزيت">فلاتر الزيت</Link></div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-extrabold text-[#d9a553]">خدمة العملاء</h3>
            <p className="text-sm leading-7 text-[#c8d3cf]">السلة والدفع الآمن وبيانات التوصيل متاحة خلال خطوات إتمام الطلب.</p>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-[#99aaa4]">© {new Date().getFullYear()} أوتو زون — زيوت وفلاتر السيارات</div>
      </footer>
      <CartDrawer />
    </div>
  );
}
