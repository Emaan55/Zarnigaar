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
  const term = query.trim();
  if (!term) return [];
  const supabase = await createClient();
  const like = `%${term}%`;

  // Products matched by name are one query; products reachable through a
  // matching category or collection name are two more, since PostgREST
  // can't OR a filter across an embedded foreign table in one request.
  const [byName, matchingCategories, matchingCollections] = await Promise.all([
    supabase.from("products").select(PRODUCT_SELECT).eq("status", "active").ilike("name", like).limit(24),
    supabase.from("categories").select("id").ilike("name", like),
    supabase.from("collections").select("id").ilike("name", like),
  ]);

  const results = new Map<string, Product>();
  for (const row of byName.data ?? []) results.set(row.id, mapProduct(row));

  const categoryIds = (matchingCategories.data ?? []).map((c) => c.id);
  if (categoryIds.length > 0) {
    const { data } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "active")
      .in("category_id", categoryIds)
      .limit(24);
    for (const row of data ?? []) results.set(row.id, mapProduct(row));
  }

  const collectionIds = (matchingCollections.data ?? []).map((c) => c.id);
  if (collectionIds.length > 0) {
    const { data: links } = await supabase
      .from("collection_products")
      .select("product_id")
      .in("collection_id", collectionIds);
    const productIds = [...new Set((links ?? []).map((l) => l.product_id))];
    if (productIds.length > 0) {
      const { data } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("status", "active")
        .in("id", productIds)
        .limit(24);
      for (const row of data ?? []) results.set(row.id, mapProduct(row));
    }
  }

  return [...results.values()];
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
