import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { OrderStatusSelect, PaymentStatusSelect } from "@/components/admin/order-status-select";
import { getAdminOrderById } from "@/data/admin";
import { formatPrice } from "@/lib/format";
import type { OrderStatus, PaymentStatus } from "@/types/database";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/orders" className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl">{order.order_number}</h1>
        <div className="flex gap-3">
          <OrderStatusSelect orderId={order.id} status={order.status as OrderStatus} />
          <PaymentStatusSelect orderId={order.id} status={order.payment_status as PaymentStatus} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="border border-border p-5 lg:col-span-2">
          <h2 className="font-heading text-lg">Items</h2>
          <ul className="mt-3 flex flex-col divide-y divide-border">
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
              <span>{formatPrice(order.shipping)}</span>
            </div>
            {order.discount_total > 0 && (
              <div className="flex justify-between text-accent-sage">
                <span>Discount {order.discount_code && `(${order.discount_code})`}</span>
                <span>-{formatPrice(order.discount_total)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-medium">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-border p-5">
            <h2 className="font-heading text-lg">Customer</h2>
            <p className="mt-2 text-sm">{order.customer_name}</p>
            <p className="text-sm text-muted-foreground">{order.customer_email}</p>
            <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
          </div>
          <div className="border border-border p-5">
            <h2 className="font-heading text-lg">Delivery Address</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {order.address}
              <br />
              {order.city}, {order.province} {order.postal_code}
            </p>
          </div>
          <div className="border border-border p-5">
            <h2 className="font-heading text-lg">Payment</h2>
            <p className="mt-2 text-sm capitalize text-muted-foreground">
              {order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
