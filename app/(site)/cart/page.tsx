"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Minus, Plus, X } from "lucide-react";
import { PageHeader } from "@/components/shop/page-header";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart, cartSubtotal } from "@/hooks/use-cart";
import { applyCoupon } from "@/actions/discounts";
import { calculateShipping } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const lines = useCart((s) => s.lines);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const couponCode = useCart((s) => s.couponCode);
  const discountAmount = useCart((s) => s.discountAmount);
  const setCoupon = useCart((s) => s.setCoupon);
  const clearCoupon = useCart((s) => s.clearCoupon);

  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const subtotal = cartSubtotal(lines);
  const shipping = calculateShipping(subtotal);
  const total = Math.max(subtotal - discountAmount, 0) + shipping;

  function handleApplyCoupon() {
    startTransition(async () => {
      const result = await applyCoupon(code, subtotal);
      setMessage(result.message);
      if (result.valid && result.code && result.discountAmount !== undefined) {
        setCoupon(result.code, result.discountAmount);
      }
    });
  }

  return (
    <>
      <PageHeader title="Your Bag" />
      <div className="container-page py-14">
        {lines.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">Your bag is empty.</p>
            <Button render={<Link href="/new-in">Shop New Arrivals</Link>} />
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ul className="flex flex-col divide-y divide-border">
                {lines.map((line) => (
                  <li key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4 py-6">
                    <div className="relative h-32 w-24 shrink-0 overflow-hidden">
                      <PlaceholderImage seed={line.slug} className="h-full w-full" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/product/${line.slug}`} className="font-heading text-lg">
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
                            className="p-2"
                            onClick={() => updateQuantity(line.productId, line.size, line.color, line.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                          <span className="min-w-8 text-center text-sm">{line.quantity}</span>
                          <button
                            className="p-2"
                            onClick={() => updateQuantity(line.productId, line.size, line.color, line.quantity + 1)}
                            aria-label="Increase quantity"
                            disabled={line.quantity >= line.stock}
                          >
                            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                        <p className="font-medium">{formatPrice(line.price * line.quantity)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-fit border border-border p-6">
              <h2 className="font-heading text-xl">Order Summary</h2>

              <div className="mt-5">
                <label htmlFor="coupon" className="text-xs font-medium tracking-wide uppercase">
                  Coupon Code
                </label>
                <div className="mt-2 flex gap-2">
                  <Input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code" />
                  <Button variant="outline" onClick={handleApplyCoupon} disabled={pending}>
                    Apply
                  </Button>
                </div>
                {message && <p className="mt-2 text-xs text-muted-foreground">{message}</p>}
                {couponCode && (
                  <button onClick={clearCoupon} className="mt-1 text-xs underline underline-offset-4">
                    Remove coupon ({couponCode})
                  </button>
                )}
              </div>

              <Separator className="my-5" />

              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-accent-sage">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <Separator className="my-1" />
                <div className="flex justify-between text-base font-medium">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button size="lg" className="mt-6 w-full rounded-none" render={<Link href="/checkout">Proceed to Checkout</Link>} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
