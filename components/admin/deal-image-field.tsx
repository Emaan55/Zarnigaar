"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImageToStorage } from "@/lib/supabase/upload";
import { recordMedia } from "@/actions/admin/media";

export function DealImageField({ defaultValue = "" }: { defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const urlInput = useRef<HTMLInputElement>(null);

  async function upload(file?: File) {
    if (!file) return;
    setError(null);
    if (!["image/png", "image/jpeg", "image/webp", "image/avif"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError("Choose a PNG, JPEG, WebP or AVIF image under 5 MB.");
      return;
    }
    setUploading(true);
    urlInput.current?.setCustomValidity("Wait for the image upload to finish.");
    try {
      const image = await uploadImageToStorage(file);
      const result = await recordMedia({ ...image, filename: file.name });
      if (!result.ok) throw new Error("Could not save image in the media library.");
      setUrl(image.url);
    } catch {
      setError("Could not upload the image. Try again before saving.");
    } finally {
      setUploading(false);
      urlInput.current?.setCustomValidity("");
    }
  }

  return (
    <div className="grid gap-1.5">
      <Label htmlFor="imageUrl">Deal image</Label>
      <Input ref={urlInput} id="imageUrl" name="imageUrl" value={url} onChange={(event) => setUrl(event.target.value)} readOnly={uploading} placeholder="Paste a Media Library image URL or upload below" />
      <Input aria-label="Upload deal image" type="file" accept="image/png,image/jpeg,image/webp,image/avif" disabled={uploading} onChange={(event) => { void upload(event.target.files?.[0]); event.target.value = ""; }} />
      {uploading && <p role="status" className="text-sm">Uploading image…</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {url.startsWith("https://") && <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs underline">View selected image</a>}
    </div>
  );
}
