import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/page-header";
import { ProductGrid } from "@/components/shop/product-grid";
import { searchProducts } from "@/data/products";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const products = q ? await searchProducts(q) : [];

  return (
    <>
      <PageHeader
        title={q ? `Search results for "${q}"` : "Search"}
        description={q ? `${products.length} product${products.length === 1 ? "" : "s"} found.` : "Search by product name, category or collection."}
      />
      <div className="container-page py-14">
        <ProductGrid products={products} />
      </div>
    </>
  );
}
