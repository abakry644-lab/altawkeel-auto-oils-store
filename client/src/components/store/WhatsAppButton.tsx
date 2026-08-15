import { createWhatsAppUrl } from "@/lib/contact";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href={createWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="راسلنا مباشرة عبر واتساب"
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full bg-[#25D366] p-1.5 pl-4 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(37,211,102,.35)] transition hover:-translate-y-0.5 hover:bg-[#1fb95a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] active:scale-[.97]"
    >
      <span className="hidden sm:inline">راسلنا عبر واتساب</span>
      <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#1da851] shadow-sm">
        <MessageCircle size={23} fill="currentColor" strokeWidth={1.8} />
      </span>
    </a>
  );
}
