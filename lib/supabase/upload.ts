import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";

export async function uploadImageToStorage(file: File) {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `uploads/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteImageFromStorage(path: string) {
  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
