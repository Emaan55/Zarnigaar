import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/page-header";
import { ProductGrid } from "@/components/shop/product-grid";
import { getProductsByCategory } from "@/data/products";

export const metadata: Metadata = { title: "Women" };

export default async function WomenPage() {
  const products = await getProductsByCategory("clothing", 48);

  return (
    <>
      <PageHeader title="Women" description="Lawn suits, co-ord sets and embroidered pieces for everyday elegance." />
      <div className="container-page py-14">
        <ProductGrid products={products} />
      </div>
    </>
  );
}
