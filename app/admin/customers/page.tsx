import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function date(value?: string) {
  return value ? new Intl.DateTimeFormat("en-PK", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" }).format(new Date(value)) : "Never";
}

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const parsed = Number(params.page ?? 1);
  const page = Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return <div><h1 className="font-heading text-2xl">Customers</h1><p className="mt-4">Customer activity is unavailable. Configure the server-side Supabase service-role key.</p></div>;
  }
  const { data, error } = await createAdminClient().auth.admin.listUsers({ page, perPage: 50 });
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl">Customers & accounts</h1>
      <p className="text-sm text-muted-foreground">Registered accounts and their latest sign-in, shown in Pakistan time. This is not a list of currently online users or a history of every login.</p>
      {error ? <p role="alert">Could not load accounts. Check server credentials and Supabase connectivity.</p> : (
        <>
          <div className="overflow-x-auto border border-border">
            <Table>
              <TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Name</TableHead><TableHead>Signed up</TableHead><TableHead>Last sign-in</TableHead><TableHead>Email confirmed</TableHead></TableRow></TableHeader>
              <TableBody>
                {data.users.length === 0 && <TableRow><TableCell colSpan={5}>No accounts on this page.</TableCell></TableRow>}
                {data.users.map((user) => <TableRow key={user.id}>
                  <TableCell>{user.email ?? "No email"}</TableCell>
                  <TableCell>{typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "—"}</TableCell>
                  <TableCell>{date(user.created_at)}</TableCell>
                  <TableCell>{date(user.last_sign_in_at)}</TableCell>
                  <TableCell>{user.email_confirmed_at ? "Yes" : "No"}</TableCell>
                </TableRow>)}
              </TableBody>
            </Table>
          </div>
          <nav aria-label="Customer pages" className="flex items-center gap-4 text-sm">
            {page > 1 && <Link href={`/admin/customers?page=${page - 1}`} className="underline">Previous</Link>}
            <span>Page {page}</span>
            {data.users.length === 50 && <Link href={`/admin/customers?page=${page + 1}`} className="underline">Next</Link>}
          </nav>
        </>
      )}
    </div>
  );
}
