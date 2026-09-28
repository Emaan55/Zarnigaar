"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGrid } from "@/components/shop/product-grid";
import type { Product, ProductCategory } from "@/types/catalog";

const TABS: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "clothing", label: "Clothing" },
  { value: "scarves", label: "Scarves" },
  { value: "dupattas", label: "Dupattas" },
  { value: "accessories", label: "Accessories" },
];

export function CategoryTabsGrid({ products }: { products: Product[] }) {
  const [tab, setTab] = useState<ProductCategory | "all">("all");
  const filtered = tab === "all" ? products : products.filter((p) => p.category === tab);

  return (
    <div>
      <div className="flex justify-center">
        <Tabs value={tab} onValueChange={(v) => setTab(v as ProductCategory | "all")}>
          <TabsList className="h-auto flex-wrap gap-1 bg-transparent">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="rounded-none border-0 border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-ink data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="mt-10">
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
