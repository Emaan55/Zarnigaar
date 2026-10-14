"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { dealSchema } from "@/lib/validation/deal";
import { requireAdmin } from "@/lib/require-admin";
import type { FormState } from "@/actions/admin/categories";


function toDbPayload(data: z.infer<typeof dealSchema>) {
  return {
    title: data.title,
    description: data.description || null,
    image_url: data.imageUrl || null,
    cta_label: data.ctaLabel || null,
    cta_href: data.ctaHref || null,
    ...(data.startsAt !== undefined ? { starts_at: data.startsAt || null } : {}),
    ...(data.endsAt !== undefined ? { ends_at: data.endsAt || null } : {}),
    active: data.active === "on",
  };
}

export async function createDeal(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = dealSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("deals").insert(toDbPayload(parsed.data));
  if (error) return { error: error.message };

  revalidatePath("/admin/deals");
  revalidatePath("/");
  return { error: null, success: true };
}

export async function updateDeal(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = dealSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("deals").update(toDbPayload(parsed.data)).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/deals");
  revalidatePath("/");
  return { error: null, success: true };
}

export async function deleteDeal(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("deals").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/deals");
  revalidatePath("/");
  return { ok: true };
}
