"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

export function OrderFilters({ status, q }: { status: string; q: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(q);

  function push(next: { status?: string; q?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.status !== undefined) {
      if (next.status === "all") params.delete("status");
      else params.set("status", next.status);
    }
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }
    router.push(`/admin/orders?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          push({ q: query });
        }}
        className="flex gap-2"
      >
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order #, name or email" className="w-64" />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>
      <Select value={status} onValueChange={(value) => value && push({ status: value })}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s} className="capitalize">
              {s === "all" ? "All Statuses" : s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
