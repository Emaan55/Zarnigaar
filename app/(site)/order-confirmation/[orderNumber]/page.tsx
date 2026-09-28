import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getOrderByNumber } from "@/data/orders";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent-sage" strokeWidth={1.25} />
        <h1 className="mt-4 font-heading text-3xl">Thank you for your order!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Order <span className="font-medium text-foreground">{order.order_number}</span> has been placed
          successfully.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl border border-border p-6 sm:p-8">
        <h2 className="font-heading text-xl">Order Details</h2>
        <ul className="mt-4 flex flex-col divide-y divide-border">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex justify-between gap-2 py-3 text-sm">
              <div>
                <p>{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {[item.size, item.color].filter(Boolean).join(" / ")} &times; {item.quantity}
                </p>
              </div>
              <span>{formatPrice(item.line_total)}</span>
            </li>
          ))}
        </ul>

        <Separator className="my-4" />

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          {order.discount_total > 0 && (
            <div className="flex justify-between text-accent-sage">
              <span>Discount {order.discount_code && `(${order.discount_code})`}</span>
              <span>-{formatPrice(order.discount_total)}</span>
            </div>
          )}
          <Separator className="my-1" />
          <div className="flex justify-between text-base font-medium">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Payment Method</h3>
            <p className="mt-1 text-sm">{order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
          </div>
          <div>
            <h3 className="text-xs font-medium tracking-wide uppercase text-muted-foreground">Delivery To</h3>
            <p className="mt-1 text-sm">
              {order.customer_name}
              <br />
              {order.address}, {order.city}, {order.province} {order.postal_code}
              <br />
              {order.customer_phone}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button render={<Link href="/new-in">Continue Shopping</Link>} size="lg" className="rounded-none px-8" />
      </div>
    </div>
  );
}
