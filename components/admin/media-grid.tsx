"use client";

import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";
import { deleteMedia } from "@/actions/admin/media";
import type { Tables } from "@/types/database";

export function MediaGrid({ media }: { media: Tables<"media">[] }) {
  const [pending, startTransition] = useTransition();

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  }

  if (media.length === 0) {
    return <p className="py-16 text-center text-sm text-muted-foreground">No media uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {media.map((item) => (
        <div key={item.id} className="group relative aspect-square overflow-hidden border border-border">
          <Image src={item.url} alt={item.filename} fill sizes="200px" className="object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => copyUrl(item.url)}
              aria-label="Copy URL"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-ink"
            >
              <Copy className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const result = await deleteMedia(item.id, item.path);
                  if (!result.ok) toast.error(result.message ?? "Could not delete");
                  else toast.success("Deleted");
                })
              }
              aria-label="Delete"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-destructive"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
