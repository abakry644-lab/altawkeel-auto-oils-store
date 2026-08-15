import { useRef } from "react";
import { usePersistFn } from "./usePersistFn";

export interface UseCompositionReturn<
  T extends HTMLInputElement | HTMLTextAreaElement,
> {
  onCompositionStart: React.CompositionEventHandler<T>;
  onCompositionEnd: React.CompositionEventHandler<T>;
  onKeyDown: React.KeyboardEventHandler<T>;
  isComposing: () => boolean;
}

export interface UseCompositionOptions<
  T extends HTMLInputElement | HTMLTextAreaElement,
> {
  onKeyDown?: React.KeyboardEventHandler<T>;
  onCompositionStart?: React.CompositionEventHandler<T>;
  onCompositionEnd?: React.CompositionEventHandler<T>;
}

export function useComposition<
  T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>(options: UseCompositionOptions<T> = {}): UseCompositionReturn<T> {
  const {
    onKeyDown: originalOnKeyDown,
    onCompositionStart: originalOnCompositionStart,
    onCompositionEnd: originalOnCompositionEnd,
  } = options;
  const composing = useRef(false);
  const primaryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const secondaryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onCompositionStart = usePersistFn(
    (event: React.CompositionEvent<T>) => {
      if (primaryTimer.current) clearTimeout(primaryTimer.current);
      if (secondaryTimer.current) clearTimeout(secondaryTimer.current);
      primaryTimer.current = null;
      secondaryTimer.current = null;
      composing.current = true;
      originalOnCompositionStart?.(event);
    }
  );

  const onCompositionEnd = usePersistFn((event: React.CompositionEvent<T>) => {
    primaryTimer.current = setTimeout(() => {
      secondaryTimer.current = setTimeout(() => {
        composing.current = false;
      });
    });
    originalOnCompositionEnd?.(event);
  });

  const onKeyDown = usePersistFn((event: React.KeyboardEvent<T>) => {
    if (
      composing.current &&
      (event.key === "Escape" || (event.key === "Enter" && !event.shiftKey))
    ) {
      event.stopPropagation();
      return;
    }
    originalOnKeyDown?.(event);
  });

  return {
    onCompositionStart,
    onCompositionEnd,
    onKeyDown,
    isComposing: () => composing.current,
  };
}
