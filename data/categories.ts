import "server-only";
import { createClient } from "@/lib/supabase/server";
import { mapCategory } from "@/lib/mappers";
import type { Category } from "@/types/catalog";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error || !data) return [];
  return data.map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return mapCategory(data);
}
