import "server-only";
import { createClient } from "@/lib/supabase/server";
import { mapFaq } from "@/lib/mappers";
import type { FaqItem } from "@/types/catalog";

export async function getFaqs(): Promise<FaqItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("category")
    .order("position");
  if (error || !data) return [];
  return data.map(mapFaq);
}
