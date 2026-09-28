import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AdminFormDialog } from "@/components/admin/admin-form-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { createCategory, updateCategory, deleteCategory } from "@/actions/admin/categories";
import { getCategories } from "@/data/categories";

function CategoryFields({ defaults }: { defaults?: { name: string; slug: string; description: string; image_url: string } }) {
  return (
    <>
      <div className="grid gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={defaults?.name} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={defaults?.slug} placeholder="clothing" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={defaults?.description} rows={3} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" defaultValue={defaults?.image_url} placeholder="From Media Library" />
      </div>
    </>
  );
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">Categories</h1>
        <AdminFormDialog
          action={createCategory}
          title="Add Category"
          successMessage="Category created"
          trigger={
            <Button className="rounded-none">
              <Plus className="h-4 w-4" strokeWidth={1.5} /> Add Category
            </Button>
          }
        >
          <CategoryFields />
        </AdminFormDialog>
      </div>

      <div className="overflow-x-auto border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No categories yet.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell className="max-w-sm truncate text-muted-foreground">{category.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <AdminFormDialog
                        action={updateCategory.bind(null, category.id)}
                        title="Edit Category"
                        successMessage="Category updated"
                        trigger={<button className="text-xs underline underline-offset-4">Edit</button>}
                      >
                        <CategoryFields
                          defaults={{
                            name: category.name,
                            slug: category.slug,
                            description: category.description,
                            image_url: category.imageUrl,
                          }}
                        />
                      </AdminFormDialog>
                      <DeleteButton onDelete={deleteCategory.bind(null, category.id)} />
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
