"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImageToStorage } from "@/lib/supabase/upload";
import { addProductImage, removeProductImage } from "@/actions/admin/products";
import type { ProductImage } from "@/types/catalog";

export function ProductImagesManager({ productId, images }: { productId: string; images: ProductImage[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    let position = images.length;
    for (const file of Array.from(files)) {
      try {
        const { url } = await uploadImageToStorage(file);
        await addProductImage(productId, url, file.name, position++);
      } catch {
        toast.error(`Could not upload ${file.name}`);
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg">Product Images</h2>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading} className="rounded-none">
          <Upload className="h-4 w-4" strokeWidth={1.5} /> {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {images.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No images yet. Product cards will show a placeholder.</p>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-[3/4] overflow-hidden border border-border">
              <Image src={img.url} alt={img.alt} fill sizes="150px" className="object-cover" />
              <button
                onClick={async () => {
                  const result = await removeProductImage(img.id, productId);
                  if (!result.ok) toast.error(result.message ?? "Could not remove image");
                  else router.refresh();
                }}
                aria-label="Remove image"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-cream/90 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
