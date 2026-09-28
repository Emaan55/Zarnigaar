"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteButton({
  onDelete,
  confirmMessage = "Delete this item? This cannot be undone.",
}: {
  onDelete: () => Promise<{ ok: boolean; message?: string }>;
  confirmMessage?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-label="Delete"
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          const result = await onDelete();
          if (!result.ok) toast.error(result.message ?? "Could not delete");
          else toast.success("Deleted");
        });
      }}
      className="text-muted-foreground hover:text-destructive disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
    </button>
  );
}
