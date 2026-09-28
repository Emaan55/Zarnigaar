import "server-only";
import { createClient } from "@/lib/supabase/server";
import { mapCollection } from "@/lib/mappers";
import type { Collection } from "@/types/catalog";

export async function getCollections(): Promise<Collection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("collections").select("*").order("name");
  if (error || !data) return [];
  return data.map(mapCollection);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return mapCollection(data);
}
