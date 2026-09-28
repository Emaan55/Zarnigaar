import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/shared/social-icons";

const FOOTER_LINKS = {
  Shop: [
    { href: "/women", label: "Women" },
    { href: "/scarves", label: "Scarves" },
    { href: "/new-in", label: "New In" },
    { href: "/collection", label: "Collections" },
  ],
  Help: [
    { href: "/faq", label: "FAQ" },
    { href: "/faq#shipping", label: "Shipping" },
    { href: "/faq#returns", label: "Returns & Exchanges" },
    { href: "/contact", label: "Contact Us" },
  ],
  About: [
    { href: "/about", label: "Our Story" },
    { href: "/about#craftsmanship", label: "Craftsmanship" },
    { href: "/account", label: "My Account" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-beige/60">
      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-2">
          <Image src="/logo.png" alt="Zarnigaar" width={64} height={64} className="h-14 w-14 object-contain" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Timeless Pakistani fashion — premium lawn, embroidered clothing and signature scarves,
            crafted for the modern woman.
          </p>
          <div className="mt-5 flex items-center gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-foreground hover:text-foreground"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-foreground hover:text-foreground"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="mailto:hello@zarnigaar.example"
              aria-label="Email"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-foreground hover:text-foreground"
            >
              <Mail className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h3 className="font-heading text-base">{title}</h3>
            <ul className="mt-4 space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {year} Zarnigaar. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/faq" className="hover:text-foreground">
              FAQ
            </Link>
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
