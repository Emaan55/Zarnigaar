import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/page-header";
import { ProductGrid } from "@/components/shop/product-grid";
import { getProductsByCategory } from "@/data/products";

export const metadata: Metadata = { title: "Scarves" };

export default async function ScarvesPage() {
  const products = await getProductsByCategory("scarves", 48);

  return (
    <>
      <PageHeader title="Scarves" description="Signature printed and woven scarves, finished in lightweight fabrics." />
      <div className="container-page py-14">
        <ProductGrid products={products} />
      </div>
    </>
  );
}
