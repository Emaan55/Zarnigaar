"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "cn";
import { createClient } from "@/lib/supabase/client";
import { toggleWishlistItem } from "@/actions/wishlist";
import { useGuestWishlist } from "@/hooks/use-wishlist";
import type { WishlistLine } from "@/types/cart";

interface WishlistButtonProps {
  product: WishlistLine;
  className?: string;
  initialActive?: boolean;
}

export function WishlistButton({ product, className, initialActive }: WishlistButtonProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [authedActive, setAuthedActive] = useState(!!initialActive);
  const [pending, startTransition] = useTransition();
  const guestHas = useGuestWishlist((s) => s.has(product.productId));
  const guestToggle = useGuestWishlist((s) => s.toggle);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const active = userId ? authedActive : guestHas;

  function handleClick() {
    if (userId) {
      setAuthedActive((prev) => !prev);
      startTransition(async () => {
        const result = await toggleWishlistItem(product.productId);
        if (!result.ok) setAuthedActive((prev) => !prev);
      });
    } else {
      guestToggle(product);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-cream/90 text-foreground shadow-sm transition-colors hover:bg-cream",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", active && "fill-foreground")} strokeWidth={1.5} />
    </button>
  );
}
