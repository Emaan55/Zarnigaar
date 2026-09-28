import { requireAdmin } from "@/lib/require-admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminMobileNav />
        <div className="p-5 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
