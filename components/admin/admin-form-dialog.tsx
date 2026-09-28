"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { FormState } from "@/actions/admin/categories";

interface AdminFormDialogProps {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
  successMessage?: string;
}

export function AdminFormDialog({ action, trigger, title, children, successMessage }: AdminFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, { error: null });

  useEffect(() => {
    if (state.success) {
      toast.success(successMessage ?? "Saved");
      setOpen(false);
    }
  }, [state.success, successMessage]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<span />}>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg bg-cream">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-normal">{title}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          {children}
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" disabled={pending} className="rounded-none">
            {pending ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
