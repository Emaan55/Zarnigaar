import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.uuid("Invalid product"),
  rating: z.coerce.number().int().min(1, "Choose a star rating").max(5),
  displayName: z.string().trim().min(2, "Enter a display name").max(60),
  body: z.string().trim().min(10, "Write at least 10 characters").max(2000, "Keep your review under 2,000 characters"),
});
