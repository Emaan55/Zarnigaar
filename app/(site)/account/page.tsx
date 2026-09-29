import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shop/page-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { getUserOrders } from "@/data/orders";
import { signOut } from "@/actions/auth";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "My Account" };

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: profile }, orders] = await Promise.all([
    supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle(),
    getUserOrders(user.id),
  ]);

  return (
    <>
      <PageHeader title="My Account" />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-3">
        <div>
          <h2 className="font-heading text-xl">Profile</h2>
          <div className="mt-4 flex flex-col gap-1 text-sm">
            <p className="font-medium">{profile?.full_name || "N/A"}</p>
            <p className="text-muted-foreground">{user.email}</p>
            {profile?.phone && <p className="text-muted-foreground">{profile.phone}</p>}
          </div>

          <Separator className="my-6" />

          <nav className="flex flex-col gap-3 text-sm">
            <Link href="/wishlist" className="hover:underline">
              My Wishlist
            </Link>
            <Link href="/faq" className="hover:underline">
              Help &amp; FAQ
            </Link>
          </nav>

          <form action={signOut} className="mt-6">
            <Button type="submit" variant="outline" className="rounded-none">
              Logout
            </Button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-heading text-xl">Order History</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">You haven&apos;t placed any orders yet.</p>
          ) : (
            <ul className="mt-4 flex flex-col divide-y divide-border">
              {orders.map((order) => (
                <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-4">
                  <div>
                    <Link href={`/account/orders/${order.order_number}`} className="font-medium hover:underline">
                      {order.order_number}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-PK", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                    <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
