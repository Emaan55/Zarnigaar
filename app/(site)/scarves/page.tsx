import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/page-header";
import { ProductGrid } from "@/components/shop/product-grid";
import { getProductsByCategory } from "@/data/products";

export const metadata: Metadata = { title: "Scarves" };

export default async function ScarvesPage() {
  const products = await getProductsByCategory("scarves", 48);

  return (
    <>
      <PageHeader title="Scarves" description="Explore our scarves. Find details on each product page." />
      <div className="container-page py-14">
        <ProductGrid products={products} />
      </div>
    </>
  );
}
