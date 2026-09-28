import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/page-header";
import { ProductGrid } from "@/components/shop/product-grid";
import { GuestWishlist } from "@/components/shop/guest-wishlist";
import { createClient } from "@/lib/supabase/server";
import { getWishlistProducts } from "@/data/wishlist";

export const metadata: Metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const products = user ? await getWishlistProducts(user.id) : null;

  return (
    <>
      <PageHeader title="Wishlist" />
      <div className="container-page py-14">
        {products ? <ProductGrid products={products} /> : <GuestWishlist />}
      </div>
    </>
  );
}
