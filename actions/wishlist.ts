"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getOrCreateWishlistId(userId: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("wishlists")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (error || !created) throw new Error("Could not create wishlist");
  return created.id;
}

export async function toggleWishlistItem(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, reason: "unauthenticated" as const };
  }

  const wishlistId = await getOrCreateWishlistId(user.id);

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("wishlist_id", wishlistId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase.from("wishlist_items").delete().eq("id", existing.id);
    revalidatePath("/wishlist");
    return { ok: true, state: "removed" as const };
  }

  await supabase.from("wishlist_items").insert({ wishlist_id: wishlistId, product_id: productId });
  revalidatePath("/wishlist");
  return { ok: true, state: "added" as const };
}
