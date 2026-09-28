"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import type { OrderStatus, PaymentStatus } from "@/types/database";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}

export async function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("orders").update({ payment_status: paymentStatus }).eq("id", orderId);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}
