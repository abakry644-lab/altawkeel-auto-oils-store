import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/store";
import { ArrowLeft, MessageCircle, Minus, PackageOpen, Plus, Trash2, X } from "lucide-react";

export default function CartDrawer() {
  const { cart, closeCart, isOpen, loading, removeItem, updateQuantity, sendOrderToWhatsApp } = useCart();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="سلة التسوق">
      <button aria-label="إغلاق السلة" onClick={closeCart} className="absolute inset-0 bg-[#102c27]/45 backdrop-blur-[2px]" />
      <aside className="absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-[#fbfaf7] shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="flex items-center justify-between border-b border-[#e7e1d8] px-6 py-5">
          <div><p className="text-xs font-bold text-[#9c7b52]">مشترياتك المختارة</p><h2 className="text-xl font-extrabold text-[#163d36]">سلة التسوق</h2></div>
          <button onClick={closeCart} className="grid h-10 w-10 place-items-center rounded-xl border border-[#e1d8ca] text-[#496058] hover:bg-white" aria-label="إغلاق"><X size={20} /></button>
        </div>
        {!cart?.items.length ? (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <div><span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-[#efede7] text-[#a77b3b]"><PackageOpen size={30} /></span><h3 className="text-lg font-extrabold text-[#1b3831]">السلة هادئة الآن</h3><p className="mt-2 max-w-[250px] text-sm leading-6 text-[#718079]">أضف المنتجات التي تحتاجها وسيظهر إجمالي طلبك هنا.</p></div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="grid gap-5">
                {cart.items.map(item => (
                  <article key={item.lineId} className="flex gap-3 border-b border-[#ece7de] pb-5">
                    <img src={item.image?.url ?? "/manus-storage/engine-oil-premium_be3b91a4.png"} alt={item.productTitle} className="h-20 w-20 rounded-2xl bg-[#f0eee8] object-cover" />
                    <div className="min-w-0 flex-1"><h3 className="line-clamp-2 text-sm font-extrabold text-[#24443b]">{item.productTitle}</h3>{item.variantTitle !== "Default Title" && <p className="mt-1 text-xs text-[#7c8983]">{item.variantTitle}</p>}<p className="mt-2 text-sm font-bold text-[#a66d29]">{formatPrice(item.unitPrice)}</p>
                      <div className="mt-3 flex items-center justify-between"><div className="flex items-center rounded-xl border border-[#e3dbcf] bg-white"><button disabled={loading} onClick={() => updateQuantity(item.lineId, item.quantity - 1)} className="grid h-8 w-8 place-items-center text-[#2f554a] disabled:opacity-40" aria-label="إنقاص الكمية"><Minus size={15} /></button><span className="w-7 text-center text-xs font-bold">{item.quantity}</span><button disabled={loading} onClick={() => updateQuantity(item.lineId, item.quantity + 1)} className="grid h-8 w-8 place-items-center text-[#2f554a] disabled:opacity-40" aria-label="زيادة الكمية"><Plus size={15} /></button></div><button disabled={loading} onClick={() => removeItem(item.lineId)} className="p-1.5 text-[#ad6458] hover:text-[#7f372f]" aria-label="حذف المنتج"><Trash2 size={17} /></button></div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="border-t border-[#e7e1d8] bg-white px-6 py-5"><div className="mb-4 flex items-end justify-between"><span className="text-sm font-bold text-[#61726b]">الإجمالي</span><strong className="text-2xl font-extrabold text-[#163d36]">{formatPrice(cart.total)}</strong></div><button disabled={loading} onClick={sendOrderToWhatsApp} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_10px_20px_rgba(37,211,102,.25)] transition hover:bg-[#1fb95a] active:scale-[.97] disabled:opacity-60">إرسال الطلب عبر واتساب <ArrowLeft size={18} /></button><p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-[#798780]"><MessageCircle size={15} className="text-[#25A856]" /> بعد فتح واتساب ستُفرغ السلة تلقائيًا لبدء طلب جديد.</p></div>
          </>
        )}
      </aside>
    </div>
  );
}
