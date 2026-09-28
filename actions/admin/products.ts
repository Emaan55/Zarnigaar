"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { productSchema, parseTagList } from "@/lib/validation/product";

export interface ProductFormState {
  error: string | null;
}

function toDbPayload(data: ReturnType<typeof productSchema.parse>) {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description,
    price: data.price,
    sale_price: data.salePrice ? Number(data.salePrice) : null,
    sku: data.sku,
    stock: data.stock,
    category_id: data.categoryId,
    sizes: parseTagList(data.sizes),
    colors: parseTagList(data.colors),
    is_new: !!data.isNew,
    is_featured: !!data.isFeatured,
    is_sold_out: !!data.isSoldOut,
    status: data.status,
  };
}

export async function createProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const { supabase } = await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = productSchema.safeParse({
    ...raw,
    isNew: raw.isNew === "on",
    isFeatured: raw.isFeatured === "on",
    isSoldOut: raw.isSoldOut === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { data: product, error } = await supabase
    .from("products")
    .insert(toDbPayload(parsed.data))
    .select("id")
    .single();

  if (error || !product) {
    return { error: error?.message.includes("duplicate") ? "SKU or slug already exists." : error?.message ?? "Could not create product." };
  }

  revalidatePath("/admin/products");
  redirect(`/admin/products/${product.id}`);
}

export async function updateProduct(id: string, _prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const { supabase } = await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = productSchema.safeParse({
    ...raw,
    isNew: raw.isNew === "on",
    isFeatured: raw.isFeatured === "on",
    isSoldOut: raw.isSoldOut === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("products").update(toDbPayload(parsed.data)).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath(`/product/${parsed.data.slug}`);
  return { error: null };
}

export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function addProductImage(productId: string, url: string, alt: string, position: number) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("product_images").insert({ product_id: productId, url, alt, position });
  if (error) return { ok: false, message: error.message };
  revalidatePath(`/admin/products/${productId}`);
  return { ok: true };
}

export async function removeProductImage(imageId: string, productId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) return { ok: false, message: error.message };
  revalidatePath(`/admin/products/${productId}`);
  return { ok: true };
}
