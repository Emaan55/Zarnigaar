import Link from "next/link";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProduct } from "@/actions/admin/products";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, sku, price, sale_price, stock, status, is_new, is_featured, is_sold_out, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">Products</h1>
        <Button render={<Link href="/admin/products/new">Add Product</Link>} className="rounded-none">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </div>

      <div className="overflow-x-auto border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!products || products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No products yet.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link href={`/admin/products/${product.id}`} className="font-medium hover:underline">
                      {product.name}
                    </Link>
                    <div className="mt-1 flex gap-1">
                      {product.is_new && <Badge variant="secondary" className="rounded-none text-[10px]">NEW</Badge>}
                      {product.is_featured && <Badge variant="secondary" className="rounded-none text-[10px]">FEATURED</Badge>}
                      {product.is_sold_out && <Badge variant="secondary" className="rounded-none text-[10px]">SOLD OUT</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                  <TableCell className="text-muted-foreground">{product.categories?.name ?? "—"}</TableCell>
                  <TableCell>
                    {formatPrice(product.sale_price ?? product.price)}
                    {product.sale_price && (
                      <span className="ml-1.5 text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>
                    )}
                  </TableCell>
                  <TableCell className={product.stock <= 5 ? "text-accent-rose" : undefined}>{product.stock}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">{product.status}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${product.id}`} className="text-xs underline underline-offset-4">
                        Edit
                      </Link>
                      <DeleteButton onDelete={deleteProduct.bind(null, product.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
