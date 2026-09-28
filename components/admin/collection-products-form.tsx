"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { setCollectionProducts } from "@/actions/admin/collections";

interface ProductOption {
  id: string;
  name: string;
  sku: string;
}

export function CollectionProductsForm({
  collectionId,
  products,
  initialSelected,
}: {
  collectionId: string;
  products: ProductOption[];
  initialSelected: string[];
}) {
  const [selected, setSelected] = useState(new Set(initialSelected));
  const [pending, startTransition] = useTransition();

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex max-h-96 flex-col divide-y divide-border overflow-y-auto border border-border">
        {products.map((product) => (
          <li key={product.id} className="flex items-center gap-3 px-4 py-2.5">
            <Checkbox
              id={product.id}
              checked={selected.has(product.id)}
              onCheckedChange={() => toggle(product.id)}
            />
            <label htmlFor={product.id} className="flex-1 cursor-pointer text-sm">
              {product.name} <span className="text-xs text-muted-foreground">{product.sku}</span>
            </label>
          </li>
        ))}
      </ul>
      <Button
        className="w-fit rounded-none"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await setCollectionProducts(collectionId, [...selected]);
            toast.success("Collection updated");
          })
        }
      >
        {pending ? "Saving..." : "Save Products"}
      </Button>
    </div>
  );
}
