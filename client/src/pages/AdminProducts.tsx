import { useAuth } from "@/_core/hooks/useAuth";
import BrandLogo from "@/components/store/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import { trpc } from "@/lib/trpc";
import { normalizeProductHandle, PRODUCT_CATEGORIES, type CatalogProduct } from "@shared/catalog";
import {
  ArrowRight,
  CheckCircle2,
  ImageUp,
  KeyRound,
  Loader2,
  LogIn,
  LogOut,
  PackagePlus,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

type ProductForm = {
  handle: string;
  title: string;
  category: (typeof PRODUCT_CATEGORIES)[number];
  description: string;
  price: string;
  imageUrl: string;
  imageAltText: string;
  tags: string;
  available: boolean;
};

const emptyForm = (): ProductForm => ({
  handle: "",
  title: "",
  category: "زيوت المحرك",
  description: "",
  price: "",
  imageUrl: "",
  imageAltText: "",
  tags: "",
  available: true,
});

function getAdminFormErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : "";
  try {
    const payload = JSON.parse(raw);
    const issue = Array.isArray(payload) ? payload[0] : payload?.zodError?.issues?.[0];
    if (issue?.path?.includes("description")) return "اكتب وصفًا من 3 أحرف على الأقل.";
    if (issue?.path?.includes("handle")) return "اكتب رابطًا صالحًا أو اتركه فارغًا ليُنشأ تلقائيًا.";
    if (typeof issue?.message === "string" && issue.message.length < 160) return issue.message;
  } catch {
    // Keep the generic Arabic message below for non-JSON errors.
  }
  if (raw.includes("رابط المنتج مستخدم")) return raw;
  return "تعذر حفظ المنتج. راجع الحقول المطلوبة وحاول مرة أخرى.";
}

function productToForm(product: CatalogProduct): ProductForm {
  return {
    handle: product.handle,
    title: product.title,
    category: product.category as ProductForm["category"],
    description: product.description,
    price: product.price.amount,
    imageUrl: product.image.url,
    imageAltText: product.image.altText ?? "",
    tags: product.tags.join("، "),
    available: product.available,
  };
}

function RailwayAdminLogin() {
  const [password, setPassword] = useState("");
  const utils = trpc.useUtils();
  const loginMutation = trpc.auth.railwayLogin.useMutation({
    onSuccess: async () => {
      setPassword("");
      await utils.auth.me.invalidate();
      toast.success("تم تسجيل الدخول إلى لوحة الإدارة.");
    },
    onError: error => toast.error(error.message || "تعذر تسجيل الدخول.") ,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) {
      toast.error("أدخل كلمة مرور الإدارة.");
      return;
    }
    await loginMutation.mutateAsync({ password });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3 text-right" dir="rtl">
      <Label htmlFor="railway-admin-password">كلمة مرور الإدارة</Label>
      <Input
        id="railway-admin-password"
        type="password"
        value={password}
        onChange={event => setPassword(event.target.value)}
        autoComplete="current-password"
        placeholder="أدخل كلمة المرور"
        required
      />
      <Button type="submit" disabled={loginMutation.isPending} className="w-full bg-[var(--brand-deep)] hover:bg-[var(--brand-forest)]">
        {loginMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <KeyRound size={16} />}
        {loginMutation.isPending ? "جارٍ التحقق…" : "دخول لوحة الإدارة"}
      </Button>
    </form>
  );
}

function AdminProductsLive() {
  const { user, loading: authLoading, logout } = useAuth();
  const { products, isLoading, refetch } = useCatalogProducts();
  const utils = trpc.useUtils();
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeletion, setPendingDeletion] = useState<CatalogProduct | null>(null);

  const createMutation = trpc.catalog.create.useMutation({
    onSuccess: async () => {
      await utils.catalog.list.invalidate();
      toast.success("تمت إضافة المنتج إلى المتجر.");
      setForm(emptyForm());
      setEditingId(null);
    },
  });
  const updateMutation = trpc.catalog.update.useMutation({
    onSuccess: async () => {
      await utils.catalog.list.invalidate();
      toast.success("تم حفظ تعديلات المنتج.");
      setForm(emptyForm());
      setEditingId(null);
    },
  });
  const removeMutation = trpc.catalog.remove.useMutation({
    onSuccess: async () => {
      await utils.catalog.list.invalidate();
      toast.success("تم حذف المنتج من الكتالوج.");
      setForm(emptyForm());
      setEditingId(null);
    },
  });
  const uploadMutation = trpc.catalog.uploadImage.useMutation({
    onSuccess: ({ url }) => {
      setForm(current => ({ ...current, imageUrl: url }));
      toast.success("تم رفع صورة المنتج.");
    },
  });

  const isAdmin = user?.role === "admin";
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.title.localeCompare(b.title, "ar")),
    [products]
  );

  const updateField = <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => setForm(current => ({ ...current, [field]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("أدخل سعرًا صحيحًا أكبر من صفر.");
      return;
    }
    if (!form.imageUrl.trim()) {
      toast.error("أضف صورة للمنتج أو ارفعها من جهازك.");
      return;
    }
    const description = form.description.trim();
    if (description.length < 3) {
      toast.error("اكتب وصفًا من 3 أحرف على الأقل.");
      return;
    }

    const normalizedHandle = normalizeProductHandle(form.handle || form.title);
    if (normalizedHandle.length < 3) {
      toast.error("اكتب اسم المنتج أو رابطًا صالحًا من 3 أحرف على الأقل.");
      return;
    }

    const product = {
      handle: normalizedHandle,
      title: form.title.trim(),
      category: form.category,
      description,
      price,
      imageUrl: form.imageUrl.trim(),
      imageAltText: form.imageAltText.trim() || undefined,
      tags: form.tags
        .split(/[،,]/)
        .map(tag => tag.trim())
        .filter(Boolean),
      available: form.available,
    };

    try {
      if (editingId) await updateMutation.mutateAsync({ id: editingId, product });
      else await createMutation.mutateAsync(product);
    } catch (error) {
      toast.error(getAdminFormErrorMessage(error));
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!(["image/jpeg", "image/png", "image/webp"] as string[]).includes(file.type)) {
      toast.error("ارفع صورة بصيغة JPG أو PNG أو WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("يجب ألا يتجاوز حجم الصورة 5 ميجابايت.");
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("تعذر قراءة الصورة."));
      reader.readAsDataURL(file);
    });

    try {
      await uploadMutation.mutateAsync({
        fileName: file.name,
        contentType: file.type as "image/jpeg" | "image/png" | "image/webp",
        base64: dataUrl.split(",")[1] ?? "",
      });
    } catch (error) {
      toast.error(getAdminFormErrorMessage(error));
    } finally {
      event.target.value = "";
    }
  };

  if (authLoading) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="animate-spin text-[var(--brand-deep)]" /></div>;
  }

  if (!user) {
    return (
      <AdminNotice
        icon={<LogIn size={26} />}
        title="سجّل الدخول لفتح لوحة الإدارة"
        text="لوحة المنتجات محمية بحساب المالك. سجّل دخولك أولًا للمتابعة."
        action={<RailwayAdminLogin />}
      />
    );
  }

  if (!isAdmin) {
    return <AdminNotice icon={<ShieldCheck size={26} />} title="لا تملك صلاحية الإدارة" text="هذه الصفحة متاحة لحساب مالك متجر التوكيل فقط." />;
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[var(--brand-canvas)] text-[var(--brand-ink)]">
      <header className="border-b border-[var(--brand-border)] bg-[var(--brand-panel)]">
        <div className="container flex min-h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3"><BrandLogo tagline={false} /><div className="border-r border-[var(--brand-border)] pr-3"><p className="text-xs font-black text-[var(--brand-gold)]">لوحة التحكم</p><h1 className="text-lg font-black">إدارة المنتجات</h1></div></div>
          <div className="flex items-center gap-2"><Link href="/" className="hidden rounded-xl px-3 py-2 text-sm font-bold text-[#52625c] hover:bg-[#f4f0e9] sm:inline-flex"><ArrowRight size={16} /> عرض المتجر</Link><Button variant="outline" size="sm" onClick={() => void logout()}><LogOut size={15} /> خروج</Button></div>
        </div>
      </header>

      <div className="container grid gap-7 py-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start">
        <section className="overflow-hidden rounded-[1.7rem] border border-[#e5ddd2] bg-white shadow-[0_18px_55px_rgba(20,51,43,.07)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee8e0] px-6 py-5"><div><p className="text-sm font-black">الكتالوج</p><p className="mt-1 text-xs text-[#6e7c75]">{isLoading ? "جارٍ التحميل…" : `${sortedProducts.length} منتجات قابلة للإدارة`}</p></div><Button variant="outline" size="sm" onClick={() => void refetch()}>تحديث القائمة</Button></div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {sortedProducts.map(product => <article key={product.id} className="overflow-hidden rounded-2xl border border-[#ece6de] bg-[#fcfbf8]"><img src={product.image.url} alt={product.image.altText ?? product.title} className="aspect-[1.45] w-full object-cover" /><div className="space-y-3 p-4"><div><p className="text-[11px] font-black text-[#b87727]">{product.category}</p><h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-black">{product.title}</h2></div><div className="flex items-center justify-between"><span className="text-sm font-black">{product.price.amount} ج.م</span><span className={product.available ? "inline-flex items-center gap-1 text-xs font-bold text-emerald-700" : "text-xs font-bold text-[#8c675d]"}>{product.available && <CheckCircle2 size={13} />}{product.available ? "متاح" : "مخفي"}</span></div><div className="flex gap-2"><Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditingId(product.id); setForm(productToForm(product)); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Pencil size={14} /> تعديل</Button><Button size="icon" variant="outline" aria-label={`حذف ${product.title}`} className="text-red-700 hover:bg-red-50 hover:text-red-800" disabled={removeMutation.isPending} onClick={() => setPendingDeletion(product)}><Trash2 size={15} /></Button></div></div></article>)}
          </div>
        </section>

        <section className="sticky top-5 rounded-[1.7rem] border border-[#e5ddd2] bg-white p-6 shadow-[0_18px_55px_rgba(20,51,43,.07)]">
          <div className="mb-5 flex items-center justify-between"><div><p className="text-sm font-black">{editingId ? "تعديل منتج" : "إضافة منتج"}</p><p className="mt-1 text-xs text-[#6e7c75]">ستظهر التغييرات فور الحفظ.</p></div>{editingId && <Button variant="ghost" size="sm" onClick={() => { setEditingId(null); setForm(emptyForm()); }}>إلغاء</Button>}</div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Field label="اسم المنتج"><Input value={form.title} onChange={event => updateField("title", event.target.value)} placeholder="مثال: زيت محرك…" required /></Field>
            <Field label="رابط المنتج (اختياري)"><Input value={form.handle} dir="ltr" onChange={event => updateField("handle", normalizeProductHandle(event.target.value))} placeholder="يُنشأ تلقائيًا من اسم المنتج" /><p className="text-[11px] leading-5 text-[#6e7c75]">يمكن تركه فارغًا؛ سيُنشأ تلقائيًا من اسم المنتج، أو اكتب رابطًا مخصصًا.</p></Field>
            <div className="grid grid-cols-2 gap-3"><Field label="التصنيف"><select value={form.category} onChange={event => updateField("category", event.target.value as ProductForm["category"])} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><>{PRODUCT_CATEGORIES.map(category => <option key={category}>{category}</option>)}</></select></Field><Field label="السعر (ج.م)"><Input value={form.price} inputMode="decimal" onChange={event => updateField("price", event.target.value)} placeholder="350" required /></Field></div>
            <Field label="وصف المنتج"><Textarea value={form.description} onChange={event => updateField("description", event.target.value)} placeholder="اكتب وصفًا واضحًا للمنتج…" className="min-h-28" required /><p className="text-[11px] leading-5 text-[#6e7c75]">اكتب 3 أحرف على الأقل، مثل: شيل اسود.</p></Field>
            <Field label="الصورة"><div className="space-y-2"><Input value={form.imageUrl} dir="ltr" onChange={event => updateField("imageUrl", event.target.value)} placeholder="رابط الصورة أو ارفع من جهازك" required /><Label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#cdbb9c] bg-[#fcf9f3] text-xs font-bold text-[#8e672e] hover:bg-[#f7f0e5]"><ImageUp size={15} />{uploadMutation.isPending ? "جارٍ رفع الصورة…" : "رفع صورة من الجهاز"}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="sr-only" /></Label>{form.imageUrl && <img src={form.imageUrl} alt="معاينة المنتج" className="aspect-[1.7] w-full rounded-xl border border-[#ece6de] object-cover" />}</div></Field>
            <Field label="وصف بديل للصورة"><Input value={form.imageAltText} onChange={event => updateField("imageAltText", event.target.value)} placeholder="مثال: عبوة زيت محرك" /></Field>
            <Field label="وسوم (افصل بينها بفاصلة)"><Input value={form.tags} onChange={event => updateField("tags", event.target.value)} placeholder="زيت محرك، 5 لتر" /></Field>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#ece6de] px-3 py-3 text-sm font-bold"><span>إظهار المنتج في المتجر</span><input type="checkbox" checked={form.available} onChange={event => updateField("available", event.target.checked)} className="size-4 accent-[#163d36]" /></label>
            <Button type="submit" className="w-full bg-[var(--brand-deep)] hover:bg-[var(--brand-forest)]" disabled={isSaving || uploadMutation.isPending}>{isSaving && <Loader2 className="animate-spin" size={16} />}{editingId ? "حفظ التعديلات" : "إضافة المنتج"}</Button>
          </form>
        </section>
      </div>
      {pendingDeletion && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#102b25]/45 p-4" role="presentation">
          <section role="dialog" aria-modal="true" aria-labelledby="delete-product-title" className="w-full max-w-md rounded-[1.7rem] bg-white p-6 shadow-2xl">
            <span className="grid size-11 place-items-center rounded-2xl bg-red-50 text-red-700"><Trash2 size={19} /></span>
            <h2 id="delete-product-title" className="mt-4 text-lg font-black">حذف المنتج؟</h2>
            <p className="mt-2 text-sm leading-7 text-[#62716c]">سيُحذف <strong className="text-[#183c34]">{pendingDeletion.title}</strong> من المتجر. لا يمكن استرجاعه من هذه اللوحة.</p>
            <div className="mt-6 flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => setPendingDeletion(null)}>إلغاء</Button><Button className="bg-red-700 hover:bg-red-800" disabled={removeMutation.isPending} onClick={async () => { try { await removeMutation.mutateAsync({ id: pendingDeletion.id }); setPendingDeletion(null); } catch { toast.error("تعذر حذف المنتج."); } }}>{removeMutation.isPending && <Loader2 className="animate-spin" size={16} />}حذف المنتج</Button></div>
          </section>
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-xs font-black text-[#42534d]">{label}</span>{children}</label>;
}

function AdminNotice({ icon, title, text, action }: { icon: React.ReactNode; title: string; text: string; action?: React.ReactNode }) {
  return <main dir="rtl" className="grid min-h-screen place-items-center bg-[var(--brand-canvas)] p-6"><section className="w-full max-w-md rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-panel)] p-8 text-center shadow-[0_18px_55px_color-mix(in_oklab,var(--brand-deep)_8%,transparent)]"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand-deep)]">{icon}</span><h1 className="mt-5 text-xl font-black text-[var(--brand-ink)]">{title}</h1><p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{text}</p><div className="mt-6 flex justify-center">{action ?? <Link href="/" className="rounded-xl bg-[var(--brand-deep)] px-4 py-2.5 text-sm font-bold text-white">العودة للمتجر</Link>}</div></section></main>;
}

export default function AdminProducts() {
  if (import.meta.env.VITE_GITHUB_PAGES === "true") {
    return <AdminNotice icon={<ShieldCheck size={26} />} title="الإدارة متاحة على النسخة الحية" text="لإدارة المنتجات، افتح موقع التوكيل المستضاف على Manus. GitHub Pages يعرض نسخة المتجر الثابتة فقط." />;
  }
  return <AdminProductsLive />;
}
