import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shop/page-header";
import { Separator } from "@/components/ui/separator";
import { getOrderByNumber } from "@/data/orders";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Order Details" };

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  // getOrderByNumber runs through the session-scoped Supabase client, so
  // RLS (orders_select_owner_or_admin) already limits this to the caller's
  // own orders — a non-owner gets null here, same as a missing order.
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <>
      <PageHeader title={`Order ${order.order_number}`} />
      <div className="container-page py-14">
        <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Back to Account
        </Link>

        <div className="mx-auto mt-6 max-w-2xl border border-border p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
              <p className="mt-1 text-sm font-medium capitalize">{order.status}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Placed On</p>
              <p className="mt-1 text-sm">
                {new Date(order.created_at).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          <Separator className="my-5" />

          <ul className="flex flex-col divide-y divide-border">
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
                <span>Discount</span>
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
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Payment Method</h3>
              <p className="mt-1 text-sm">{order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Delivery To</h3>
              <p className="mt-1 text-sm">
                {order.customer_name}
                <br />
                {order.address}, {order.city}, {order.province} {order.postal_code}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
