"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { WishlistButton } from "@/components/product/wishlist-button";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] ?? product.images[0];
  const onSale = product.salePrice !== null && product.salePrice < product.price;

  return (
    <div
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-beige">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          {primaryImage ? (
            <>
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className={`object-cover transition-opacity duration-500 ${hovered && secondaryImage ? "opacity-0" : "opacity-100"}`}
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage.url}
                  alt={secondaryImage.alt || product.name}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className={`object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
                />
              )}
            </>
          ) : (
            <PlaceholderImage seed={product.slug} className="h-full w-full" />
          )}
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && <Badge className="rounded-none bg-ink px-2.5 py-1 text-[10px] tracking-wider text-cream">NEW</Badge>}
          {onSale && (
            <Badge className="rounded-none bg-accent-rose px-2.5 py-1 text-[10px] tracking-wider text-ink">SALE</Badge>
          )}
          {product.isSoldOut && (
            <Badge variant="secondary" className="rounded-none px-2.5 py-1 text-[10px] tracking-wider">
              SOLD OUT
            </Badge>
          )}
        </div>

        <WishlistButton
          className="absolute right-3 top-3"
          product={{
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: primaryImage?.url ?? "",
            price: product.price,
            salePrice: product.salePrice,
          }}
        />
      </div>

      <Link href={`/product/${product.slug}`} className="mt-3">
        <h3 className="font-heading text-[15px] leading-tight">{product.name}</h3>
        <div className="mt-1.5 flex items-center gap-2 text-sm">
          {onSale ? (
            <>
              <span className="font-medium text-foreground">{formatPrice(product.salePrice!)}</span>
              <span className="text-muted-foreground line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-medium text-foreground">{formatPrice(product.price)}</span>
          )}
        </div>
      </Link>
    </div>
  );
}
