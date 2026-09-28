"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { calculateDiscountAmount } from "@/lib/pricing";

export interface CouponResult {
  valid: boolean;
  message: string;
  code?: string;
  discountAmount?: number;
}

// Coupon validation reads with the service-role client because discounts
// carries no public select policy (see supabase/migrations/0002_policies.sql)
// — codes and usage limits aren't meant to be scraped by the client.
export async function applyCoupon(code: string, subtotal: number): Promise<CouponResult> {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return { valid: false, message: "Enter a coupon code." };

  const supabase = createAdminClient();
  const { data: discount, error } = await supabase
    .from("discounts")
    .select("*")
    .eq("code", trimmed)
    .eq("active", true)
    .maybeSingle();

  if (error || !discount) return { valid: false, message: "Invalid coupon code." };

  const now = new Date();
  if (discount.starts_at && new Date(discount.starts_at) > now) {
    return { valid: false, message: "This coupon isn't active yet." };
  }
  if (discount.ends_at && new Date(discount.ends_at) < now) {
    return { valid: false, message: "This coupon has expired." };
  }
  if (discount.usage_limit !== null && discount.used_count >= discount.usage_limit) {
    return { valid: false, message: "This coupon has reached its usage limit." };
  }
  if (subtotal < discount.min_order) {
    return { valid: false, message: `Minimum order for this coupon is Rs. ${discount.min_order}.` };
  }

  const discountAmount = calculateDiscountAmount(
    { type: discount.type, value: Number(discount.value) },
    subtotal
  );

  return { valid: true, message: "Coupon applied.", code: discount.code, discountAmount };
}
