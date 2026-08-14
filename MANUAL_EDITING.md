# التعديل اليدوي على متجر التوكيل

يعمل المتجر الآن **دون الاعتماد على Shopify**. تُدار المنتجات والأسعار والصور يدويًا من ملفات المشروع، بينما تُرسل الطلبات مباشرة عبر واتساب.

| العنصر | مكان التعديل اليدوي |
| --- | --- |
| المنتجات والأسعار والصور والتصنيفات | `client/src/data/catalog.ts` |
| النصوص والأقسام في الصفحة الرئيسية | `client/src/pages/Home.tsx` |
| تصميم شريط التنقل والتذييل | `client/src/components/store/StoreShell.tsx` |
| البحث والتصفية وعرض المنتجات | `client/src/pages/Shop.tsx` |
| تصميم صفحة تفاصيل المنتج | `client/src/pages/ProductDetail.tsx` |
| الألوان والخطوط والتنسيق العام | `client/src/index.css` |

## إضافة منتج جديد

أضف كائنًا جديدًا إلى مصفوفة `LOCAL_PRODUCTS` في ملف `client/src/data/catalog.ts`. يجب أن يحتوي على معرف فريد، و`handle` فريد للرابط، واسم المنتج، والتصنيف، والوصف، والسعر بالجنيه، ورابط صورة من `/manus-storage/`، والوسوم، وحالة التوفر.

```ts
{
  id: "oil-10w40",
  handle: "oil-10w40",
  title: "زيت محرك 10W-40",
  category: "زيوت المحرك",
  description: "وصف واضح للمنتج ومواصفاته.",
  price: { amount: "350", currencyCode: "EGP" },
  image: { url: "/manus-storage/your-image.jpg", altText: "زيت محرك 10W-40" },
  tags: ["10W-40", "زيت محرك"],
  available: true,
}
```

ارفع أي صورة جديدة إلى التخزين الثابت للمشروع أولًا، ثم استخدم رابط `/manus-storage/` الناتج داخل حقل `image.url`.
