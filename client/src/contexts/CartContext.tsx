import { dispatchCartOrderToWhatsApp } from "@/lib/contact";
import { findLocalProduct } from "@/data/catalog";
import type { Cart, CartItem } from "@shared/commerce/types";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

const CART_STORAGE_KEY = "altawkeel:local-cart";

function emptyCart(): Cart {
  return {
    id: "local-cart",
    checkoutUrl: "",
    items: [],
    itemCount: 0,
    subtotal: { amount: "0", currencyCode: "EGP" },
    total: { amount: "0", currencyCode: "EGP" },
  };
}

function createLocalCart(items: CartItem[]): Cart {
  const normalizedItems = items.map(item => ({
    ...item,
    lineTotal: { ...item.unitPrice, amount: String(Number(item.unitPrice.amount) * item.quantity) },
  }));
  const total = normalizedItems.reduce((sum, item) => sum + Number(item.lineTotal.amount), 0);

  return {
    id: "local-cart",
    checkoutUrl: "",
    items: normalizedItems,
    itemCount: normalizedItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: { amount: String(total), currencyCode: "EGP" },
    total: { amount: String(total), currencyCode: "EGP" },
  };
}

function readLocalCart() {
  if (typeof window === "undefined") return emptyCart();
  try {
    const saved = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) return emptyCart();
    const parsed = JSON.parse(saved) as Cart;
    return Array.isArray(parsed.items) ? createLocalCart(parsed.items) : emptyCart();
  } catch {
    return emptyCart();
  }
}

function persistLocalCart(cart: Cart) {
  if (typeof window === "undefined") return;
  if (cart.items.length) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  else window.localStorage.removeItem(CART_STORAGE_KEY);
}

type CartContextValue = {
  cart: Cart;
  isOpen: boolean;
  loading: boolean;
  itemCount: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
  sendOrderToWhatsApp: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(readLocalCart);
  const [isOpen, setIsOpen] = useState(false);

  const updateCart = useCallback((items: CartItem[]) => {
    const nextCart = createLocalCart(items);
    setCart(nextCart);
    persistLocalCart(nextCart);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(async (productId: string, quantity: number = 1) => {
    const product = findLocalProduct(productId);
    if (!product || !product.available) return;

    const currentItem = cart.items.find(item => item.variantId === product.id);
    const items = currentItem
      ? cart.items.map(item => item.variantId === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      : [...cart.items, {
          lineId: product.id,
          variantId: product.id,
          productHandle: product.handle,
          productTitle: product.title,
          variantTitle: "Default Title",
          image: product.image,
          unitPrice: product.price,
          quantity,
          lineTotal: product.price,
        }];

    updateCart(items);
    setIsOpen(true);
  }, [cart.items, updateCart]);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    const items = quantity <= 0
      ? cart.items.filter(item => item.lineId !== lineId)
      : cart.items.map(item => item.lineId === lineId ? { ...item, quantity } : item);
    updateCart(items);
  }, [cart.items, updateCart]);

  const removeItem = useCallback(async (lineId: string) => {
    updateCart(cart.items.filter(item => item.lineId !== lineId));
  }, [cart.items, updateCart]);

  const clearCart = useCallback(() => updateCart([]), [updateCart]);

  const sendOrderToWhatsApp = useCallback(() => {
    dispatchCartOrderToWhatsApp(cart, {
      openUrl: url => window.open(url, "_blank", "noopener,noreferrer"),
      clearCart,
      closeCart,
    });
  }, [cart, clearCart, closeCart]);

  const value = useMemo<CartContextValue>(() => ({
    cart,
    isOpen,
    loading: false,
    itemCount: cart.itemCount,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    sendOrderToWhatsApp,
  }), [addItem, cart, clearCart, closeCart, isOpen, removeItem, sendOrderToWhatsApp, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
