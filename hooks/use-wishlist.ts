"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistLine } from "@/types/cart";

// Guest wishlist store, persisted to localStorage. For authenticated users
// the wishlist lives in Supabase (wishlists/wishlist_items) and is driven
// by actions/wishlist.ts instead — see WishlistButton for how the two are
// reconciled per viewer.
interface GuestWishlistState {
  items: WishlistLine[];
  has: (productId: string) => boolean;
  toggle: (item: WishlistLine) => void;
  remove: (productId: string) => void;
}

export const useGuestWishlist = create<GuestWishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      has: (productId) => get().items.some((i) => i.productId === productId),
      toggle: (item) => {
        const exists = get().has(item.productId);
        set({
          items: exists
            ? get().items.filter((i) => i.productId !== item.productId)
            : [...get().items, item],
        });
      },
      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
    }),
    { name: "zarnigaar-wishlist" }
  )
);
