import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/page-header";
import { CategoryTabsGrid } from "@/components/shop/category-tabs-grid";
import { getNewArrivals } from "@/data/products";

export const metadata: Metadata = { title: "New In" };

export default async function NewInPage() {
  const products = await getNewArrivals(60);

  return (
    <>
      <PageHeader title="New In" description="The latest additions to Zarnigaar." />
      <div className="container-page py-14">
        <CategoryTabsGrid products={products} />
      </div>
    </>
  );
}
