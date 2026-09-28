import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ProductForm } from "@/components/admin/product-form";
import { ProductImagesManager } from "@/components/admin/product-images-manager";
import { updateProduct } from "@/actions/admin/products";
import { getCategories } from "@/data/categories";
import { createClient } from "@/lib/supabase/server";
import { mapProduct } from "@/lib/mappers";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: row }, categories] = await Promise.all([
    supabase
      .from("products")
      .select(
        "*, categories ( slug ), product_images ( id, url, alt, position ), collection_products ( collections ( slug ) )"
      )
      .eq("id", id)
      .maybeSingle(),
    getCategories(),
  ]);

  if (!row) notFound();
  const product = mapProduct(row);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/products" className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Back to Products
      </Link>
      <h1 className="font-heading text-2xl">{product.name}</h1>

      <ProductForm
        action={updateProduct.bind(null, id)}
        categories={categories}
        product={product}
        status={row.status}
        submitLabel="Save Changes"
      />

      <Separator />

      <ProductImagesManager productId={id} images={product.images} />
    </div>
  );
}
