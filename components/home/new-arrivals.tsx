"use client";

import Link from "next/link";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/shared/reveal";
import type { Product, ProductCategory } from "@/types/catalog";

const TABS: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "clothing", label: "Clothing" },
  { value: "scarves", label: "Scarves" },
  { value: "dupattas", label: "Dupattas" },
  { value: "accessories", label: "Accessories" },
];

export function NewArrivals({ products }: { products: Product[] }) {
  const [tab, setTab] = useState<ProductCategory | "all">("all");
  const filtered = tab === "all" ? products : products.filter((p) => p.category === tab);

  return (
    <section className="container-page py-16 sm:py-20">
      <Reveal className="text-center">
        <h2 className="font-heading text-3xl sm:text-4xl">New Arrivals</h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-8 flex justify-center">
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
      </Reveal>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          No products yet in this category. Check back soon.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {filtered.map((product, i) => (
            <Reveal key={product.id} delay={Math.min(i * 0.05, 0.3)}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Button
          variant="outline"
          size="lg"
          className="rounded-none px-8"
          render={<Link href="/new-in">View All New Arrivals</Link>}
        />
      </div>
    </section>
  );
}
