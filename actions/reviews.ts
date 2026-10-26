"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { reviewSchema } from "@/lib/validation/review";

export interface ReviewState { error?: string; success?: boolean }

export async function submitReview(_previous: ReviewState, form: FormData): Promise<ReviewState> {
  const parsed = reviewSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Please sign in before writing a review." };
  const { data: product } = await supabase.from("products").select("slug").eq("id", parsed.data.productId).eq("status", "active").maybeSingle();
  if (!product) return { error: "This product is unavailable." };
  const { error } = await supabase.from("product_reviews").insert({
    product_id: parsed.data.productId, user_id: user.id, rating: parsed.data.rating,
    display_name: parsed.data.displayName, body: parsed.data.body,
  });
  if (error) return { error: error.code === "23505" ? "You have already reviewed this product." : "Could not save your review. Please try again later." };
  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/", "layout");
  return { success: true };
}
