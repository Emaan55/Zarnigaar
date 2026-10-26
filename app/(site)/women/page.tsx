import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/page-header";
import { ProductGrid } from "@/components/shop/product-grid";
import { getProductsByCategory } from "@/data/products";

export const metadata: Metadata = { title: "Women" };

export default async function WomenPage() {
  const products = await getProductsByCategory("clothing", 48);

  return (
    <>
      <PageHeader title="Women" description="Explore our clothing articles. Find details on each product page." />
      <div className="container-page py-14">
        <ProductGrid products={products} />
      </div>
    </>
  );
}
