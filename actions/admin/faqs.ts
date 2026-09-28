"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-admin";
import type { FormState } from "@/actions/admin/categories";

const faqSchema = z.object({
  question: z.string().min(2, "Question is required"),
  answer: z.string().min(2, "Answer is required"),
  category: z.string().min(1, "Category is required"),
  position: z.coerce.number().int().optional(),
});

export async function createFaq(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = faqSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("faqs").insert({
    question: parsed.data.question,
    answer: parsed.data.answer,
    category: parsed.data.category,
    position: parsed.data.position ?? 0,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  return { error: null, success: true };
}

export async function updateFaq(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = faqSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase
    .from("faqs")
    .update({
      question: parsed.data.question,
      answer: parsed.data.answer,
      category: parsed.data.category,
      position: parsed.data.position ?? 0,
    })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  return { error: null, success: true };
}

export async function deleteFaq(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  return { ok: true };
}
