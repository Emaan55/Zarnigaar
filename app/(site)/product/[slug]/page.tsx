import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/gallery";
import { ProductActions } from "@/components/product/product-actions";
import { DeliveryInfo } from "@/components/product/delivery-info";
import { ProductGrid } from "@/components/shop/product-grid";
import { getProductBySlug, getRelatedProducts } from "@/data/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} seed={product.slug} name={product.name} />
        <div>
          <ProductActions product={product} />
          <div className="mt-8 divide-y divide-border">
            {[{ label: "Fabric details", value: product.fabricDetails }, { label: "Additional article details", value: product.additionalDetails }, { label: "Care instructions", value: product.careInstructions }, { label: "Design philosophy", value: product.designPhilosophy }].filter((detail) => detail.value).map((detail) => (
              <section key={detail.label} className="py-4">
                <h2 className="mb-2 font-medium">{detail.label}</h2>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{detail.value}</p>
              </section>
            ))}
          </div>
          <DeliveryInfo />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-8 font-heading text-2xl">You May Also Like</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
