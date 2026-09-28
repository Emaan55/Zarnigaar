import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { getDashboardStats } from "@/data/admin";
import { formatPrice } from "@/lib/format";

const STATUS_LABELS: { key: "pending" | "processing" | "shipped" | "delivered" | "cancelled"; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-heading text-2xl">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="border border-border p-4 sm:col-span-2 lg:col-span-2">
          <p className="text-xs text-muted-foreground">Total Revenue</p>
          <p className="mt-1 font-heading text-2xl">{formatPrice(stats.revenue)}</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-xs text-muted-foreground">Total Orders</p>
          <p className="mt-1 font-heading text-2xl">{stats.totalOrders}</p>
        </div>
        {STATUS_LABELS.map((s) => (
          <div key={s.key} className="border border-border p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-heading text-2xl">{stats.statusCounts[s.key]}</p>
          </div>
        ))}
      </div>

      <div className="border border-border p-5">
        <h2 className="flex items-center gap-2 font-heading text-lg">
          <AlertTriangle className="h-4 w-4 text-accent-rose" strokeWidth={1.5} /> Low Stock
        </h2>
        {stats.lowStock.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Nothing is running low.</p>
        ) : (
          <ul className="mt-3 flex flex-col divide-y divide-border">
            {stats.lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <Link href={`/admin/products/${p.id}`} className="font-medium hover:underline">
                    {p.name}
                  </Link>
                  <span className="ml-2 text-xs text-muted-foreground">{p.sku}</span>
                </div>
                <span className="text-accent-rose">{p.stock} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
