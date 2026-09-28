import "server-only";
import { createClient } from "@/lib/supabase/server";
import { mapProduct } from "@/lib/mappers";
import type { Product } from "@/types/catalog";

const PRODUCT_SELECT = `
  *,
  categories ( slug ),
  product_images ( id, url, alt, position ),
  collection_products ( collections ( slug ) )
`;

export async function getWishlistProducts(userId: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data: wishlist } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!wishlist) return [];

  const { data, error } = await supabase
    .from("wishlist_items")
    .select(`product_id, products ( ${PRODUCT_SELECT} )`)
    .eq("wishlist_id", wishlist.id);

  if (error || !data) return [];
  return data
    .map((row) => row.products)
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => mapProduct(p as never));
}
