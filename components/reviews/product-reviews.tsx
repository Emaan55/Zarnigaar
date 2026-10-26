import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/reviews/review-form";

export async function ProductReviews({ productId, slug, page }: { productId: string; slug: string; page: number }) {
  const supabase = await createClient();
  const [{ data: reviews, error }, { data: stats, error: statsError }, { data: { user } }] = await Promise.all([
    supabase.from("product_reviews").select("id, display_name, rating, body, created_at").eq("product_id", productId).order("created_at", { ascending: false }).order("id").range((page - 1) * 10, page * 10 - 1),
    supabase.from("product_review_stats").select("review_count, average_rating").eq("product_id", productId).maybeSingle(),
    supabase.auth.getUser(),
  ]);
  const { data: own } = user ? await supabase.from("product_reviews").select("id").eq("product_id", productId).eq("user_id", user.id).maybeSingle() : { data: null };
  const count = stats?.review_count ?? 0;
  return (
    <section id="reviews" className="mt-16 border-t border-border pt-10">
      <h2 className="font-heading text-2xl">Customer reviews</h2>
      {error || statsError ? <p role="status" className="mt-4 text-sm">Reviews are temporarily unavailable. Please check back later.</p> : (
        <>
          <p className="mt-3 text-sm">{count ? `★ ${Number(stats!.average_rating).toFixed(1)} out of 5 · ${count} ${count === 1 ? "review" : "reviews"}` : "No reviews yet. Be the first to share your experience."}</p>
          <div className="my-8 divide-y divide-border">
            {reviews?.map((review) => <article key={review.id} className="py-5">
              <p className="font-medium">{review.display_name}</p>
              <p className="mt-1 text-sm" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
              <time className="text-xs text-muted-foreground" dateTime={review.created_at}>{new Intl.DateTimeFormat("en-PK", { dateStyle: "medium", timeZone: "Asia/Karachi" }).format(new Date(review.created_at))}</time>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm">{review.body}</p>
            </article>)}
          </div>
          {(page > 1 || count > 10) && <nav aria-label="Review pages" className="mb-8 flex gap-4 text-sm">
            {page > 1 && <Link href={`/product/${slug}?reviewsPage=${page - 1}#reviews`} className="underline">Previous</Link>}
            <span>Page {page}</span>
            {page * 10 < count && <Link href={`/product/${slug}?reviewsPage=${page + 1}#reviews`} className="underline">Next</Link>}
          </nav>}
          {user ? own ? <p className="text-sm">You have already reviewed this product. Thank you!</p> : <ReviewForm productId={productId} /> : <Link href={`/login?redirect=${encodeURIComponent(`/product/${slug}#reviews`)}`} className="text-sm underline">Sign in to write a review</Link>}
        </>
      )}
    </section>
  );
}
