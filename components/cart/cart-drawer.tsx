"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { useCart, cartSubtotal } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const lines = useCart((s) => s.lines);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = cartSubtotal(lines);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 bg-cream p-0 sm:max-w-md">
        <SheetTitle className="border-b border-border px-6 py-5 font-heading text-xl font-normal">
          Your Bag {lines.length > 0 && `(${lines.length})`}
        </SheetTitle>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted-foreground">Your bag is empty.</p>
            <Button render={<Link href="/new-in" onClick={close}>Shop New Arrivals</Link>} />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="flex flex-col gap-5">
                {lines.map((line) => (
                  <li key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden">
                      <PlaceholderImage seed={line.slug} className="h-full w-full" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/product/${line.slug}`} onClick={close} className="font-heading text-base leading-tight">
                            {line.name}
                          </Link>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {[line.size, line.color].filter(Boolean).join(" / ")}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(line.productId, line.size, line.color)}
                          aria-label="Remove item"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            className="p-1.5"
                            onClick={() =>
                              updateQuantity(line.productId, line.size, line.color, line.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" strokeWidth={1.5} />
                          </button>
                          <span className="min-w-6 text-center text-sm">{line.quantity}</span>
                          <button
                            className="p-1.5"
                            onClick={() =>
                              updateQuantity(line.productId, line.size, line.color, line.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            disabled={line.quantity >= line.stock}
                          >
                            <Plus className="h-3 w-3" strokeWidth={1.5} />
                          </button>
                        </div>
                        <p className="text-sm font-medium">{formatPrice(line.price * line.quantity)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Shipping and discounts calculated at checkout.</p>
              <Separator className="my-4" />
              <Button
                size="lg"
                className="w-full"
                render={<Link href="/checkout" onClick={close}>Checkout</Link>}
              />
              <Button
                variant="outline"
                size="lg"
                className="mt-2 w-full"
                render={<Link href="/cart" onClick={close}>View Bag</Link>}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
