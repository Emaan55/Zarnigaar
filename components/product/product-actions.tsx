"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SizeGuideDialog } from "@/components/product/size-guide-dialog";
import { WishlistButton } from "@/components/product/wishlist-button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/catalog";

export function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);
  const [color, setColor] = useState<string | null>(product.colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);

  const price = product.salePrice ?? product.price;
  const outOfStock = product.isSoldOut || product.stock <= 0;

  function buildLine() {
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url ?? "",
      price,
      size,
      color,
      quantity,
      stock: product.stock,
    };
  }

  function handleAddToCart() {
    addItem(buildLine());
    toast.success(`${product.name} added to your bag`);
  }

  function handleBuyNow() {
    addItem(buildLine());
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl">{product.name}</h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-lg font-medium">{formatPrice(price)}</span>
          {product.salePrice !== null && (
            <span className="text-muted-foreground line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

      {product.sizes.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide uppercase">Size</span>
            <SizeGuideDialog />
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`h-10 min-w-10 border px-3 text-sm transition-colors ${
                  size === s ? "border-ink bg-ink text-cream" : "border-border hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div>
          <span className="mb-2 block text-xs font-medium tracking-wide uppercase">Color</span>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`h-10 border px-3 text-sm transition-colors ${
                  color === c ? "border-ink bg-ink text-cream" : "border-border hover:border-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <span className="mb-2 block text-xs font-medium tracking-wide uppercase">Quantity</span>
        <div className="flex w-fit items-center border border-border">
          <button className="p-2.5" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <span className="min-w-8 text-center text-sm">{quantity}</span>
          <button
            className="p-2.5"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            aria-label="Increase quantity"
            disabled={quantity >= product.stock}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <p className="text-xs font-medium">
        {outOfStock ? (
          <span className="text-destructive">Out of stock</span>
        ) : product.stock <= 5 ? (
          <span className="text-accent-rose">Only {product.stock} left in stock</span>
        ) : (
          <span className="text-accent-sage">In stock</span>
        )}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1 rounded-none" disabled={outOfStock} onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Button size="lg" variant="outline" className="flex-1 rounded-none" disabled={outOfStock} onClick={handleBuyNow}>
          Buy Now
        </Button>
        <WishlistButton
          className="h-11 w-11 shrink-0 border border-border bg-transparent hover:bg-muted"
          product={{
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images[0]?.url ?? "",
            price: product.price,
            salePrice: product.salePrice,
          }}
        />
      </div>
    </div>
  );
}
