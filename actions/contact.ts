"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";

export interface ContactResult {
  ok: boolean;
  message: string;
}

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_messages").insert(parsed.data);
  if (error) return { ok: false, message: "Could not send your message. Please try again." };

  return { ok: true, message: "Thanks, we'll get back to you soon." };
}
