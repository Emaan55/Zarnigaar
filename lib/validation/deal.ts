import { z } from "zod";

export function isSafeNavigation(value: string) {
  if (/[\s\\]/.test(value)) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export const dealSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  description: z.string().max(10000).optional(),
  imageUrl: z.url({ protocol: /^https$/ }).optional().or(z.literal("")),
  ctaLabel: z.string().max(100).optional(),
  ctaHref: z.string().refine((value) => !value || isSafeNavigation(value), "Use a site path such as /new-in or an HTTPS URL").optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  active: z.string().optional(),
});
