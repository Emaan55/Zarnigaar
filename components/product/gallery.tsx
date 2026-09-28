"use client";

import Image from "next/image";
import { useState } from "react";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import type { ProductImage } from "@/types/catalog";

export function ProductGallery({ images, seed, name }: { images: ProductImage[]; seed: string; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative h-16 w-14 shrink-0 overflow-hidden border ${i === active ? "border-ink" : "border-border"}`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img.url} alt={img.alt || name} fill sizes="60px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-beige">
        {current ? (
          <Image src={current.url} alt={current.alt || name} fill sizes="(min-width: 1024px) 45vw, 100vw" priority className="object-cover" />
        ) : (
          <PlaceholderImage seed={seed} className="h-full w-full" />
        )}
      </div>
    </div>
  );
}
