"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus, updatePaymentStatus } from "@/actions/admin/orders";
import type { OrderStatus, PaymentStatus } from "@/types/database";

const ORDER_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed"];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={pending}
      onValueChange={(value) =>
        startTransition(async () => {
          const result = await updateOrderStatus(orderId, value as OrderStatus);
          if (!result.ok) toast.error(result.message ?? "Could not update status");
          else toast.success("Order status updated");
        })
      }
    >
      <SelectTrigger className="w-40 capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="capitalize">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function PaymentStatusSelect({ orderId, status }: { orderId: string; status: PaymentStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={pending}
      onValueChange={(value) =>
        startTransition(async () => {
          const result = await updatePaymentStatus(orderId, value as PaymentStatus);
          if (!result.ok) toast.error(result.message ?? "Could not update payment status");
          else toast.success("Payment status updated");
        })
      }
    >
      <SelectTrigger className="w-40 capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PAYMENT_STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="capitalize">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
