import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  salePrice: z.coerce.number().positive().optional().or(z.literal("")),
  sku: z.string().min(2, "SKU is required"),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1, "Category is required"),
  sizes: z.string().optional(),
  colors: z.string().optional(),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isSoldOut: z.boolean().optional(),
  status: z.enum(["active", "draft", "archived"]),
});

export type ProductFormInput = z.infer<typeof productSchema>;

export function parseTagList(value?: string) {
  return (value ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}
