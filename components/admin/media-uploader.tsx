"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImageToStorage } from "@/lib/supabase/upload";
import { recordMedia } from "@/actions/admin/media";

export function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    let successCount = 0;

    for (const file of Array.from(files)) {
      try {
        const { url, path } = await uploadImageToStorage(file);
        const result = await recordMedia({ url, path, filename: file.name });
        if (result.ok) successCount++;
      } catch {
        toast.error(`Could not upload ${file.name}`);
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if (successCount > 0) {
      toast.success(`Uploaded ${successCount} image${successCount === 1 ? "" : "s"}`);
      router.refresh();
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button onClick={() => inputRef.current?.click()} disabled={uploading} className="rounded-none">
        <Upload className="h-4 w-4" strokeWidth={1.5} /> {uploading ? "Uploading..." : "Upload Images"}
      </Button>
    </div>
  );
}
