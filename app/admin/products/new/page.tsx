import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/actions/admin/products";
import { getCategories } from "@/data/categories";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/products" className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Back to Products
      </Link>
      <h1 className="font-heading text-2xl">Add Product</h1>
      <p className="text-sm text-muted-foreground">
        Save the product first, then add images from the next screen.
      </p>
      <ProductForm action={createProduct} categories={categories} submitLabel="Save & Continue" />
    </div>
  );
}
