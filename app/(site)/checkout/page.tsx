"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shop/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { checkoutSchema, PAKISTAN_PROVINCES, type CheckoutInput } from "@/lib/validation/checkout";
import { placeOrder } from "@/actions/checkout";
import { useCart, cartSubtotal } from "@/hooks/use-cart";
import { calculateShipping } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const couponCode = useCart((s) => s.couponCode);
  const discountAmount = useCart((s) => s.discountAmount);
  const clear = useCart((s) => s.clear);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const subtotal = cartSubtotal(lines);
  const shipping = calculateShipping(subtotal);
  const total = Math.max(subtotal - discountAmount, 0) + shipping;

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      province: "Punjab",
      postalCode: "",
      paymentMethod: "cod",
    },
  });

  useEffect(() => {
    if (lines.length === 0 && !submitting) {
      router.replace("/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: CheckoutInput) {
    setSubmitting(true);
    setFormError(null);
    const result = await placeOrder(values, lines, couponCode);
    if (!result.ok || !result.orderNumber) {
      setFormError(result.message ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }
    clear();
    router.push(`/order-confirmation/${result.orderNumber}`);
  }

  if (lines.length === 0) return null;

  return (
    <>
      <PageHeader title="Checkout" />
      <div className="container-page py-14">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-12 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <h2 className="font-heading text-xl">Delivery Details</h2>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="03xx-xxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PAKISTAN_PROVINCES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-2" />

              <h2 className="font-heading text-xl">Payment Method</h2>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-col gap-3">
                        <label className="flex cursor-pointer items-center gap-3 border border-border p-4 has-[[data-checked]]:border-ink">
                          <RadioGroupItem value="cod" id="cod" />
                          <div>
                            <Label htmlFor="cod" className="cursor-pointer font-medium">
                              Cash on Delivery
                            </Label>
                            <p className="text-xs text-muted-foreground">Pay when your order arrives.</p>
                          </div>
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 border border-border p-4 has-[[data-checked]]:border-ink">
                          <RadioGroupItem value="online" id="online" />
                          <div>
                            <Label htmlFor="online" className="cursor-pointer font-medium">
                              Secure Online Payment
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Coming soon — choose Cash on Delivery for now.
                            </p>
                          </div>
                        </label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {formError && <p className="text-sm text-destructive">{formError}</p>}
            </div>

            <div className="h-fit border border-border p-6">
              <h2 className="font-heading text-xl">Order Summary</h2>
              <ul className="mt-4 flex flex-col gap-2 text-sm">
                {lines.map((line) => (
                  <li key={`${line.productId}-${line.size}-${line.color}`} className="flex justify-between gap-2">
                    <span className="text-muted-foreground">
                      {line.name} &times; {line.quantity}
                    </span>
                    <span>{formatPrice(line.price * line.quantity)}</span>
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
              <div className="flex flex-col gap-2 text-sm">
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
              <Button type="submit" size="lg" className="mt-6 w-full rounded-none" disabled={submitting}>
                {submitting ? "Placing Order..." : "Place Order"}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                By placing your order you agree to our{" "}
                <Link href="/faq" className="underline underline-offset-4">
                  policies
                </Link>
                .
              </p>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
