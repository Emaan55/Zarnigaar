"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/deals", label: "Deals" },
  { href: "/admin/discounts", label: "Discounts" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/faqs", label: "FAQs" },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border bg-beige/40 px-4 py-3 lg:hidden">
      {LINKS.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 rounded-sm px-3 py-1.5 text-xs whitespace-nowrap",
              active ? "bg-ink text-cream" : "text-foreground/80"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
