import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shop/page-header";
import { ProductGrid } from "@/components/shop/product-grid";
import { getCollectionBySlug } from "@/data/collections";
import { getCollectionProducts } from "@/data/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  return { title: collection?.name ?? "Collection" };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = await getCollectionProducts(slug, 48);

  return (
    <>
      <PageHeader title={collection.name} description={collection.description} />
      <div className="container-page py-14">
        <ProductGrid products={products} />
      </div>
    </>
  );
}
