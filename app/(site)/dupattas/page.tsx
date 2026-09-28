import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/page-header";
import { ProductGrid } from "@/components/shop/product-grid";
import { getProductsByCategory } from "@/data/products";

export const metadata: Metadata = { title: "Dupattas" };

export default async function DupattasPage() {
  const products = await getProductsByCategory("dupattas", 48);

  return (
    <>
      <PageHeader title="Dupattas" description="Embellished and embroidered dupattas to complete every outfit." />
      <div className="container-page py-14">
        <ProductGrid products={products} />
      </div>
    </>
  );
}
