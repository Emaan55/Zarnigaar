import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AdminFormDialog } from "@/components/admin/admin-form-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { createFaq, updateFaq, deleteFaq } from "@/actions/admin/faqs";
import { getFaqs } from "@/data/faqs";

function FaqFields({ defaults }: { defaults?: { question: string; answer: string; category: string; position: number } }) {
  return (
    <>
      <div className="grid gap-1.5">
        <Label htmlFor="question">Question</Label>
        <Input id="question" name="question" defaultValue={defaults?.question} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="answer">Answer</Label>
        <Textarea id="answer" name="answer" defaultValue={defaults?.answer} rows={3} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" defaultValue={defaults?.category} placeholder="shipping" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="position">Position</Label>
          <Input id="position" name="position" type="number" defaultValue={defaults?.position ?? 0} />
        </div>
      </div>
    </>
  );
}

export default async function AdminFaqsPage() {
  const faqs = await getFaqs();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl">FAQs</h1>
        <AdminFormDialog
          action={createFaq}
          title="Add FAQ"
          successMessage="FAQ created"
          trigger={
            <Button className="rounded-none">
              <Plus className="h-4 w-4" strokeWidth={1.5} /> Add FAQ
            </Button>
          }
        >
          <FaqFields />
        </AdminFormDialog>
      </div>

      <div className="overflow-x-auto border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No FAQs yet.
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="max-w-md">{faq.question}</TableCell>
                  <TableCell className="text-muted-foreground">{faq.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <AdminFormDialog
                        action={updateFaq.bind(null, faq.id)}
                        title="Edit FAQ"
                        successMessage="FAQ updated"
                        trigger={<button className="text-xs underline underline-offset-4">Edit</button>}
                      >
                        <FaqFields defaults={{ question: faq.question, answer: faq.answer, category: faq.category, position: 0 }} />
                      </AdminFormDialog>
                      <DeleteButton onDelete={deleteFaq.bind(null, faq.id)} />
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
