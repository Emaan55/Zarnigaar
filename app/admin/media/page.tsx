import { MediaUploader } from "@/components/admin/media-uploader";
import { MediaGrid } from "@/components/admin/media-grid";
import { createClient } from "@/lib/supabase/server";

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data: media } = await supabase.from("media").select("*").order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">Media Library</h1>
        <MediaUploader />
      </div>
      <MediaGrid media={media ?? []} />
    </div>
  );
}
