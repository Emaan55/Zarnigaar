import "server-only";
import { createClient } from "@/lib/supabase/server";
import { mapDeal } from "@/lib/mappers";
import type { Deal } from "@/types/catalog";

export async function getActiveDeals(): Promise<Deal[]> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("active", true)
    .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
    .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapDeal);
}
