import { useRef } from "react";

type Noop = (...args: any[]) => any;

export function usePersistFn<T extends Noop>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistentFunction = useRef<T>(null);
  if (!persistentFunction.current) {
    persistentFunction.current = function (this: unknown, ...args) {
      return fnRef.current!.apply(this, args);
    } as T;
  }

  return persistentFunction.current!;
}
