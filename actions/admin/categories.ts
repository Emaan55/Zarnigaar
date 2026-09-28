"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export interface FormState {
  error: string | null;
  success?: boolean;
}

export async function createCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("categories").insert({
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    image_url: parsed.data.imageUrl || null,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/collection");
  return { error: null, success: true };
}

export async function updateCategory(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("categories")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      image_url: parsed.data.imageUrl || null,
    })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { error: null, success: true };
}

export async function deleteCategory(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/categories");
  return { ok: true };
}
