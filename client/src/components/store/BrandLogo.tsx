import { BRAND } from "@/lib/brand";

type BrandLogoProps = {
  dark?: boolean;
  tagline?: boolean;
};

export default function BrandLogo({ dark = false, tagline = true }: BrandLogoProps) {
  return (
    <span className="flex shrink-0 items-center gap-3">
      <span className="brand-mark" aria-hidden="true">
        <span className="brand-mark__orbit" />
        <img className="brand-mark__image" src={BRAND.logoSrc} alt="" />
      </span>
      <span className="leading-tight">
        <span
          className={`brand-wordmark block text-lg font-extrabold tracking-tight ${
            dark ? "text-white" : "text-[var(--brand-deep)]"
          }`}
        >
          {BRAND.name}
        </span>
        {tagline && (
          <span
            className={`block text-[10px] font-bold tracking-[.12em] ${
              dark ? "text-[var(--brand-gold-light)]" : "text-[var(--brand-muted)]"
            }`}
          >
            {BRAND.descriptor}
          </span>
        )}
      </span>
    </span>
  );
}
