"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";
import type { FormState } from "@/actions/admin/categories";

const discountSchema = z.object({
  code: z.string().min(2, "Code is required"),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().positive("Value must be greater than 0"),
  minOrder: z.coerce.number().min(0).optional(),
  usageLimit: z.coerce.number().int().positive().optional().or(z.literal("")),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  active: z.string().optional(),
});

function toDbPayload(data: z.infer<typeof discountSchema>) {
  return {
    code: data.code.trim().toUpperCase(),
    type: data.type,
    value: data.value,
    min_order: data.minOrder ?? 0,
    usage_limit: data.usageLimit ? Number(data.usageLimit) : null,
    starts_at: data.startsAt || null,
    ends_at: data.endsAt || null,
    active: data.active === "on",
  };
}

export async function createDiscount(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = discountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("discounts").insert(toDbPayload(parsed.data));
  if (error) return { error: error.message.includes("duplicate") ? "This coupon code already exists." : error.message };

  revalidatePath("/admin/discounts");
  return { error: null, success: true };
}

export async function updateDiscount(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = discountSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("discounts").update(toDbPayload(parsed.data)).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/discounts");
  return { error: null, success: true };
}

export async function deleteDiscount(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("discounts").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/discounts");
  return { ok: true };
}
