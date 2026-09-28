import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Defense-in-depth admin gate for server actions and admin pages. Proxy
 * middleware already blocks unauthenticated/non-admin requests to /admin,
 * but server actions can be invoked directly, so every admin mutation
 * calls this too before touching the database.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return { supabase, user };
}
