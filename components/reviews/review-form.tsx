"use client";

import { useActionState } from "react";
import { submitReview, type ReviewState } from "@/actions/reviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ReviewForm({ productId }: { productId: string }) {
  const [state, action, pending] = useActionState<ReviewState, FormData>(submitReview, {});
  if (state.success) return <p role="status" className="text-sm">Thank you! Your review has been published.</p>;
  return (
    <form action={action} className="grid max-w-xl gap-4">
      <h3 className="font-heading text-xl">Write a review</h3>
      <input type="hidden" name="productId" value={productId} />
      <fieldset disabled={pending} className="grid gap-4">
        <div className="grid gap-2"><Label htmlFor="review-name">Public display name</Label><Input id="review-name" name="displayName" required minLength={2} maxLength={60} autoComplete="nickname" /></div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Your rating</legend>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5].map((rating) => <label key={rating} className="flex cursor-pointer items-center gap-1 rounded border border-border px-3 py-2 text-sm"><input type="radio" name="rating" value={rating} required /><span aria-hidden="true">{rating} ★</span><span className="sr-only">{rating} {rating === 1 ? "star" : "stars"}</span></label>)}
          </div>
        </fieldset>
        <div className="grid gap-2"><Label htmlFor="review-body">Your review</Label><Textarea id="review-body" name="body" required minLength={10} maxLength={2000} rows={4} /></div>
        <p className="text-xs text-muted-foreground">Your display name, rating and review will be public. Do not include contact or payment details.</p>
        {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" className="w-fit rounded-none" disabled={pending}>{pending ? "Submitting…" : "Submit review"}</Button>
      </fieldset>
    </form>
  );
}
