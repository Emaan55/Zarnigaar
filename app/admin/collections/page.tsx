import Link from "next/link";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AdminFormDialog } from "@/components/admin/admin-form-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { createCollection, updateCollection, deleteCollection } from "@/actions/admin/collections";
import { getCollections } from "@/data/collections";

function CollectionFields({ defaults }: { defaults?: { name: string; slug: string; description: string; image_url: string } }) {
  return (
    <>
      <div className="grid gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={defaults?.name} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={defaults?.slug} placeholder="luxury-lawn" required />
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

export default async function AdminCollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">Collections</h1>
        <AdminFormDialog
          action={createCollection}
          title="Add Collection"
          successMessage="Collection created"
          trigger={
            <Button className="rounded-none">
              <Plus className="h-4 w-4" strokeWidth={1.5} /> Add Collection
            </Button>
          }
        >
          <CollectionFields />
        </AdminFormDialog>
      </div>

      <div className="overflow-x-auto border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-40">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No collections yet.
                </TableCell>
              </TableRow>
            ) : (
              collections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell className="font-medium">{collection.name}</TableCell>
                  <TableCell className="text-muted-foreground">{collection.slug}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/collections/${collection.id}`} className="text-xs underline underline-offset-4">
                        Products
                      </Link>
                      <AdminFormDialog
                        action={updateCollection.bind(null, collection.id)}
                        title="Edit Collection"
                        successMessage="Collection updated"
                        trigger={<button className="text-xs underline underline-offset-4">Edit</button>}
                      >
                        <CollectionFields
                          defaults={{
                            name: collection.name,
                            slug: collection.slug,
                            description: collection.description,
                            image_url: collection.imageUrl,
                          }}
                        />
                      </AdminFormDialog>
                      <DeleteButton onDelete={deleteCollection.bind(null, collection.id)} />
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
