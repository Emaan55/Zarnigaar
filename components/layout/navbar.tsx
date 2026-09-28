"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { NAV_LINKS } from "./nav-links";
import { useCart, cartCount } from "@/hooks/use-cart";
import { useGuestWishlist } from "@/hooks/use-wishlist";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.open);
  const count = cartCount(lines);
  const wishlistCount = useGuestWishlist((s) => s.items.length);

  if (pathname?.startsWith("/admin")) return null;

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <button className="p-1 lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" strokeWidth={1.5} />
                </button>
              }
            />
            <SheetContent side="left" className="w-[85vw] max-w-sm bg-cream p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex items-center justify-between border-b border-border px-5 py-5">
                <Image src="/logo.png" alt="Zarnigaar" width={40} height={40} className="h-10 w-10 object-contain" />
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-col px-5 py-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-border/60 py-4 font-heading text-lg"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/account" onClick={() => setMobileOpen(false)} className="py-4 text-sm">
                  My Account
                </Link>
                <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="py-4 text-sm">
                  Wishlist
                </Link>
                <Link href="/faq" onClick={() => setMobileOpen(false)} className="py-4 text-sm">
                  FAQ
                </Link>
                <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-4 text-sm">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium tracking-wide text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" className="flex shrink-0 items-center" aria-label="Zarnigaar home">
          <Image src="/logo.png" alt="Zarnigaar" width={56} height={56} priority className="h-12 w-12 object-contain lg:h-14 lg:w-14" />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-4">
          <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
            <SheetTrigger
              render={
                <button aria-label="Search" className="p-1">
                  <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </button>
              }
            />
            <SheetContent side="top" className="bg-cream">
              <SheetTitle className="sr-only">Search</SheetTitle>
              <form onSubmit={submitSearch} className="container-page flex items-center gap-3 py-6">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                <Input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories, collections..."
                  className="border-0 border-b border-border !bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                />
              </form>
            </SheetContent>
          </Sheet>

          <Link href="/account" aria-label="Account" className="hidden p-1 sm:block">
            <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </Link>

          <Link href="/wishlist" aria-label="Wishlist" className="relative p-1">
            <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-cream">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button onClick={openCart} aria-label="Cart" className="relative p-1">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-cream">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
