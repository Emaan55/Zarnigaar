"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";
import type { FormState } from "@/actions/admin/categories";

const collectionSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export async function createCollection(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = collectionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("collections").insert({
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    image_url: parsed.data.imageUrl || null,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/collections");
  revalidatePath("/collection");
  return { error: null, success: true };
}

export async function updateCollection(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = collectionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("collections")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      image_url: parsed.data.imageUrl || null,
    })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/collections");
  return { error: null, success: true };
}

export async function deleteCollection(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/collections");
  return { ok: true };
}

export async function setCollectionProducts(collectionId: string, productIds: string[]) {
  const { supabase } = await requireAdmin();

  await supabase.from("collection_products").delete().eq("collection_id", collectionId);
  if (productIds.length > 0) {
    await supabase
      .from("collection_products")
      .insert(productIds.map((productId) => ({ collection_id: collectionId, product_id: productId })));
  }

  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath("/collection");
  return { ok: true };
}
