import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/page-header";
import { ProductGrid } from "@/components/shop/product-grid";
import { getProductsByCategory } from "@/data/products";

export const metadata: Metadata = { title: "Accessories" };

export default async function AccessoriesPage() {
  const products = await getProductsByCategory("accessories", 48);

  return (
    <>
      <PageHeader title="Accessories" description="Bags and finishing pieces to complete your look." />
      <div className="container-page py-14">
        <ProductGrid products={products} />
      </div>
    </>
  );
}
