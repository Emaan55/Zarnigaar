"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";

export async function recordMedia(input: { url: string; path: string; filename: string }) {
  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("media").insert({
    url: input.url,
    path: input.path,
    filename: input.filename,
    uploaded_by: user.id,
  });
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/media");
  return { ok: true };
}

export async function deleteMedia(id: string, path: string) {
  const { supabase } = await requireAdmin();
  await supabase.storage.from("media").remove([path]);
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/media");
  return { ok: true };
}
