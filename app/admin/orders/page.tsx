import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { OrderFilters } from "@/components/admin/order-filters";
import { getAdminOrders } from "@/data/admin";
import { formatPrice } from "@/lib/format";
import type { OrderStatus } from "@/types/database";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = "all", q = "" } = await searchParams;
  const orders = await getAdminOrders({ status, q });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl">Orders</h1>

      <OrderFilters status={status} q={q} />

      <div className="overflow-x-auto border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                      {order.order_number}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <p>{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                  </TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString("en-PK")}</TableCell>
                  <TableCell className="capitalize">
                    {order.payment_method} / {order.payment_status}
                  </TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <OrderStatusSelect orderId={order.id} status={order.status as OrderStatus} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
