import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus, Tables } from "@/types/database";

const ORDER_STATUSES: readonly OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const LOW_STOCK_THRESHOLD = 5;

export async function getDashboardStats() {
  const supabase = await createClient();

  const [{ data: orders }, { data: lowStock }] = await Promise.all([
    supabase.from("orders").select("status, total"),
    supabase
      .from("products")
      .select("id, name, sku, stock")
      .eq("status", "active")
      .lte("stock", LOW_STOCK_THRESHOLD)
      .order("stock", { ascending: true })
      .limit(10),
  ]);

  const rows = orders ?? [];
  const revenue = rows
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const statusCounts: Record<OrderStatus, number> = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  for (const o of rows) {
    statusCounts[o.status as OrderStatus] = (statusCounts[o.status as OrderStatus] ?? 0) + 1;
  }

  return {
    revenue,
    totalOrders: rows.length,
    statusCounts,
    lowStock: lowStock ?? [],
  };
}

export async function getAdminOrders(filters: { status?: string; q?: string }) {
  const supabase = await createClient();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

  if (filters.status && ORDER_STATUSES.includes(filters.status as OrderStatus)) {
    query = query.eq("status", filters.status as OrderStatus);
  }
  if (filters.q) {
    query = query.or(
      `order_number.ilike.%${filters.q}%,customer_name.ilike.%${filters.q}%,customer_email.ilike.%${filters.q}%`
    );
  }

  const { data, error } = await query.limit(100);
  if (error || !data) return [];
  return data;
}

export async function getAdminOrderById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as Tables<"orders"> & { order_items: Tables<"order_items">[] };
}
