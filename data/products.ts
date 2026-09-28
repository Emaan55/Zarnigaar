import "server-only";
import { createClient } from "@/lib/supabase/server";
import { mapProduct } from "@/lib/mappers";
import type { Product, ProductCategory } from "@/types/catalog";

const PRODUCT_SELECT = `
  *,
  categories ( slug ),
  product_images ( id, url, alt, position ),
  collection_products ( collections ( slug ) )
`;

export async function getNewArrivals(limit = 6): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapProduct);
}

export async function getProductsByCategory(
  category: ProductCategory,
  limit = 24
): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .eq("categories.slug", category)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapProduct).filter((p) => p.category === category);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .eq("is_featured", true)
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) return null;
  return mapProduct(data);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .neq("id", product.id)
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .ilike("name", `%${query}%`)
    .limit(24);

  if (error || !data) return [];
  return data.map(mapProduct);
}

export async function getCollectionProducts(
  collectionSlug: string,
  limit = 24
): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `*, categories ( slug ), product_images ( id, url, alt, position ), collection_products!inner ( collections!inner ( slug ) )`
    )
    .eq("status", "active")
    .eq("collection_products.collections.slug", collectionSlug)
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapProduct);
}
