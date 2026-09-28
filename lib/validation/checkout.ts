import { z } from "zod";

export const PAKISTAN_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Kashmir",
  "Islamabad Capital Territory",
] as const;

export const checkoutSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  address: z.string().min(5, "Enter your street address"),
  city: z.string().min(2, "Enter your city"),
  province: z.enum(PAKISTAN_PROVINCES),
  postalCode: z.string().min(4, "Enter a valid postal code"),
  paymentMethod: z.enum(["cod", "online"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const cartLineSchema = z.object({
  productId: z.string().uuid(),
  size: z.string().nullable(),
  color: z.string().nullable(),
  quantity: z.number().int().positive(),
});

export const placeOrderSchema = z.object({
  customer: checkoutSchema,
  lines: z.array(cartLineSchema).min(1, "Your bag is empty"),
  couponCode: z.string().nullable(),
});
