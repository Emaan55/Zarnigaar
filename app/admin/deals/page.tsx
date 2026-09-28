import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminFormDialog } from "@/components/admin/admin-form-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { createDeal, updateDeal, deleteDeal } from "@/actions/admin/deals";
import { createClient } from "@/lib/supabase/server";

interface DealDefaults {
  title: string;
  description: string;
  image_url: string;
  cta_label: string;
  cta_href: string;
  active: boolean;
}

function DealFields({ defaults }: { defaults?: DealDefaults }) {
  return (
    <>
      <div className="grid gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={defaults?.title} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={defaults?.description} rows={2} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" defaultValue={defaults?.image_url} placeholder="From Media Library" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="ctaLabel">CTA Label</Label>
          <Input id="ctaLabel" name="ctaLabel" defaultValue={defaults?.cta_label} placeholder="Shop Now" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="ctaHref">CTA Link</Label>
          <Input id="ctaHref" name="ctaHref" defaultValue={defaults?.cta_href} placeholder="/new-in" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={defaults?.active ?? true} className="h-4 w-4" />
        Active
      </label>
    </>
  );
}

export default async function AdminDealsPage() {
  const supabase = await createClient();
  const { data: deals } = await supabase.from("deals").select("*").order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">Deals</h1>
        <AdminFormDialog
          action={createDeal}
          title="Add Deal"
          successMessage="Deal created"
          trigger={
            <Button className="rounded-none">
              <Plus className="h-4 w-4" strokeWidth={1.5} /> Add Deal
            </Button>
          }
        >
          <DealFields />
        </AdminFormDialog>
      </div>

      <div className="overflow-x-auto border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>CTA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!deals || deals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No deals yet.
                </TableCell>
              </TableRow>
            ) : (
              deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.title}</TableCell>
                  <TableCell className="text-muted-foreground">{deal.cta_label}</TableCell>
                  <TableCell>
                    <Badge variant={deal.active ? "default" : "secondary"} className="rounded-none">
                      {deal.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <AdminFormDialog
                        action={updateDeal.bind(null, deal.id)}
                        title="Edit Deal"
                        successMessage="Deal updated"
                        trigger={<button className="text-xs underline underline-offset-4">Edit</button>}
                      >
                        <DealFields
                          defaults={{
                            title: deal.title,
                            description: deal.description ?? "",
                            image_url: deal.image_url ?? "",
                            cta_label: deal.cta_label ?? "",
                            cta_href: deal.cta_href ?? "",
                            active: deal.active,
                          }}
                        />
                      </AdminFormDialog>
                      <DeleteButton onDelete={deleteDeal.bind(null, deal.id)} />
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
