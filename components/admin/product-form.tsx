"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ProductFormState } from "@/actions/admin/products";
import type { Category } from "@/types/catalog";
import type { Product } from "@/types/catalog";

interface ProductFormProps {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: Category[];
  product?: Product;
  status?: "active" | "draft" | "archived";
  submitLabel: string;
}

export function ProductForm({ action, categories, product, status = "active", submitLabel }: ProductFormProps) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, { error: null });

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" defaultValue={product?.name} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="embroidered-lawn-suit" required />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={product?.description} required />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor="price">Price (Rs.)</Label>
          <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="salePrice">Sale Price (Rs.)</Label>
          <Input id="salePrice" name="salePrice" type="number" step="0.01" defaultValue={product?.salePrice ?? ""} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" name="stock" type="number" defaultValue={product?.stock ?? 0} required />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" defaultValue={product?.sku} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={categories.find((c) => c.slug === product?.category)?.id}
            required
            className="h-9 border border-border bg-background px-2 text-sm"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="sizes">Sizes (comma-separated)</Label>
          <Input id="sizes" name="sizes" defaultValue={product?.sizes.join(", ")} placeholder="S, M, L, XL" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="colors">Colors (comma-separated)</Label>
          <Input id="colors" name="colors" defaultValue={product?.colors.join(", ")} placeholder="Black, Ivory" />
        </div>
      </div>

      <div className="grid gap-1.5 sm:w-48">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={status}
          className="h-9 border border-border bg-background px-2 text-sm"
        >
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isNew" defaultChecked={product?.isNew} className="h-4 w-4" />
          New
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} className="h-4 w-4" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isSoldOut" defaultChecked={product?.isSoldOut} className="h-4 w-4" />
          Sold Out
        </label>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending} className="w-fit rounded-none">
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
