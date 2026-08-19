import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";

const LOADING_SCREEN_SESSION_KEY = "altawkeel:opening-loader-seen";
const LOADING_SCREEN_DURATION_MS = 1050;

export default function BrandLoadingScreen() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(LOADING_SCREEN_SESSION_KEY) !== "true";
  });

  useEffect(() => {
    if (!isVisible) return;

    window.sessionStorage.setItem(LOADING_SCREEN_SESSION_KEY, "true");
    const timeoutId = window.setTimeout(() => setIsVisible(false), LOADING_SCREEN_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="brand-loader" role="status" aria-label="جارٍ تحميل متجر التوكيل">
      <div className="brand-loader__halo" aria-hidden="true" />
      <div className="brand-loader__content">
        <div className="brand-loader__mark">
          <span className="brand-loader__ring" aria-hidden="true" />
          <img
            className="brand-loader__logo"
            src={BRAND.logoSrc}
            alt=""
            aria-hidden="true"
          />
        </div>
        <p className="brand-loader__name">{BRAND.name}</p>
        <p className="brand-loader__descriptor">{BRAND.descriptor}</p>
        <span className="brand-loader__line" aria-hidden="true" />
      </div>
    </div>
  );
}

export { LOADING_SCREEN_DURATION_MS, LOADING_SCREEN_SESSION_KEY };
