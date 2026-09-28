"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";
import type { FormState } from "@/actions/admin/categories";

const dealSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  active: z.string().optional(),
});

function toDbPayload(data: z.infer<typeof dealSchema>) {
  return {
    title: data.title,
    description: data.description || null,
    image_url: data.imageUrl || null,
    cta_label: data.ctaLabel || null,
    cta_href: data.ctaHref || null,
    starts_at: data.startsAt || null,
    ends_at: data.endsAt || null,
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
  return { ok: true };
}
