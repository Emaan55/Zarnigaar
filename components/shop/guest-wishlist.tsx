"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { Button } from "@/components/ui/button";
import { useGuestWishlist } from "@/hooks/use-wishlist";
import { formatPrice } from "@/lib/format";

export function GuestWishlist() {
  const items = useGuestWishlist((s) => s.items);
  const remove = useGuestWishlist((s) => s.remove);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">Your wishlist is empty.</p>
        <Button render={<Link href="/new-in">Shop New Arrivals</Link>} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.productId} className="group flex flex-col">
          <div className="relative aspect-[3/4] overflow-hidden bg-beige">
            <Link href={`/product/${item.slug}`}>
              <PlaceholderImage seed={item.slug} className="h-full w-full" />
            </Link>
            <button
              onClick={() => remove(item.productId)}
              aria-label="Remove from wishlist"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-cream/90"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <Link href={`/product/${item.slug}`} className="mt-3">
            <h3 className="font-heading text-[15px] leading-tight">{item.name}</h3>
            <p className="mt-1.5 text-sm font-medium">{formatPrice(item.salePrice ?? item.price)}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}
