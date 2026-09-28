"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types/cart";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  couponCode: string | null;
  discountAmount: number;
  open: () => void;
  close: () => void;
  addItem: (line: CartLine) => void;
  removeItem: (productId: string, size: string | null, color: string | null) => void;
  updateQuantity: (
    productId: string,
    size: string | null,
    color: string | null,
    quantity: number
  ) => void;
  setCoupon: (code: string, discountAmount: number) => void;
  clearCoupon: () => void;
  clear: () => void;
}

function sameLine(a: CartLine, productId: string, size: string | null, color: string | null) {
  return a.productId === productId && a.size === size && a.color === color;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      couponCode: null,
      discountAmount: 0,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addItem: (line) => {
        const existing = get().lines.find((l) => sameLine(l, line.productId, line.size, line.color));
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              sameLine(l, line.productId, line.size, line.color)
                ? { ...l, quantity: Math.min(l.quantity + line.quantity, l.stock) }
                : l
            ),
          });
        } else {
          set({ lines: [...get().lines, line] });
        }
        set({ isOpen: true });
      },
      removeItem: (productId, size, color) =>
        set({ lines: get().lines.filter((l) => !sameLine(l, productId, size, color)) }),
      updateQuantity: (productId, size, color, quantity) =>
        set({
          lines: get()
            .lines.map((l) =>
              sameLine(l, productId, size, color)
                ? { ...l, quantity: Math.max(1, Math.min(quantity, l.stock)) }
                : l
            )
            .filter((l) => l.quantity > 0),
        }),
      setCoupon: (code, discountAmount) => set({ couponCode: code, discountAmount }),
      clearCoupon: () => set({ couponCode: null, discountAmount: 0 }),
      clear: () => set({ lines: [], couponCode: null, discountAmount: 0 }),
    }),
    { name: "zarnigaar-cart" }
  )
);

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
