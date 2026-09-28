"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Shirt,
  FolderTree,
  Layers,
  Megaphone,
  Ticket,
  Image as ImageIcon,
  HelpCircle,
} from "lucide-react";
import { cn } from "cn";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Shirt },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/collections", label: "Collections", icon: Layers },
  { href: "/admin/deals", label: "Deals", icon: Megaphone },
  { href: "/admin/discounts", label: "Discounts", icon: Ticket },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-beige/40 lg:block">
      <div className="sticky top-0 flex h-screen flex-col overflow-y-auto p-5">
        <Link href="/admin" className="font-heading text-lg">
          Zarnigaar Admin
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {LINKS.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors",
                  active ? "bg-ink text-cream" : "text-foreground/80 hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/" className="mt-auto text-xs text-muted-foreground hover:text-foreground">
          &larr; Back to store
        </Link>
      </div>
    </aside>
  );
}
