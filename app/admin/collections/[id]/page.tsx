import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CollectionProductsForm } from "@/components/admin/collection-products-form";

export default async function AdminCollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: collection }, { data: products }, { data: selected }] = await Promise.all([
    supabase.from("collections").select("*").eq("id", id).maybeSingle(),
    supabase.from("products").select("id, name, sku").order("name"),
    supabase.from("collection_products").select("product_id").eq("collection_id", id),
  ]);

  if (!collection) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/collections" className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Back to Collections
      </Link>
      <h1 className="font-heading text-2xl">{collection.name}: Products</h1>
      <CollectionProductsForm
        collectionId={id}
        products={products ?? []}
        initialSelected={(selected ?? []).map((s) => s.product_id)}
      />
    </div>
  );
}
