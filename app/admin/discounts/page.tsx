import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminFormDialog } from "@/components/admin/admin-form-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { createDiscount, updateDiscount, deleteDiscount } from "@/actions/admin/discounts";
import { createClient } from "@/lib/supabase/server";

interface DiscountDefaults {
  code: string;
  type: string;
  value: number;
  min_order: number;
  usage_limit: number | null;
  active: boolean;
}

function DiscountFields({ defaults }: { defaults?: DiscountDefaults }) {
  return (
    <>
      <div className="grid gap-1.5">
        <Label htmlFor="code">Coupon Code</Label>
        <Input id="code" name="code" defaultValue={defaults?.code} placeholder="EID20" required className="uppercase" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="type">Type</Label>
          <select id="type" name="type" defaultValue={defaults?.type ?? "percentage"} className="h-9 border border-border bg-background px-2 text-sm">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="value">Value</Label>
          <Input id="value" name="value" type="number" step="0.01" defaultValue={defaults?.value} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="minOrder">Min Order (Rs.)</Label>
          <Input id="minOrder" name="minOrder" type="number" defaultValue={defaults?.min_order ?? 0} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="usageLimit">Usage Limit</Label>
          <Input id="usageLimit" name="usageLimit" type="number" defaultValue={defaults?.usage_limit ?? ""} placeholder="Unlimited" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="startsAt">Starts</Label>
          <Input id="startsAt" name="startsAt" type="date" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="endsAt">Ends</Label>
          <Input id="endsAt" name="endsAt" type="date" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={defaults?.active ?? true} className="h-4 w-4" />
        Active
      </label>
    </>
  );
}

export default async function AdminDiscountsPage() {
  const supabase = await createClient();
  const { data: discounts } = await supabase.from("discounts").select("*").order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">Discounts</h1>
        <AdminFormDialog
          action={createDiscount}
          title="Add Discount"
          successMessage="Discount created"
          trigger={
            <Button className="rounded-none">
              <Plus className="h-4 w-4" strokeWidth={1.5} /> Add Discount
            </Button>
          }
        >
          <DiscountFields />
        </AdminFormDialog>
      </div>

      <div className="overflow-x-auto border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!discounts || discounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No discounts yet.
                </TableCell>
              </TableRow>
            ) : (
              discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-medium">{discount.code}</TableCell>
                  <TableCell>{discount.type === "percentage" ? `${discount.value}%` : `Rs. ${discount.value}`}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {discount.used_count}
                    {discount.usage_limit ? ` / ${discount.usage_limit}` : ""}
                  </TableCell>
                  <TableCell>
                    <Badge variant={discount.active ? "default" : "secondary"} className="rounded-none">
                      {discount.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <AdminFormDialog
                        action={updateDiscount.bind(null, discount.id)}
                        title="Edit Discount"
                        successMessage="Discount updated"
                        trigger={<button className="text-xs underline underline-offset-4">Edit</button>}
                      >
                        <DiscountFields
                          defaults={{
                            code: discount.code,
                            type: discount.type,
                            value: Number(discount.value),
                            min_order: Number(discount.min_order),
                            usage_limit: discount.usage_limit,
                            active: discount.active,
                          }}
                        />
                      </AdminFormDialog>
                      <DeleteButton onDelete={deleteDiscount.bind(null, discount.id)} />
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
