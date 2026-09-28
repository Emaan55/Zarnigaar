import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { Reveal } from "@/components/shared/reveal";

const FAVORITES = [
  { seed: "luxury-lawn", label: "Luxury Lawn", description: "Light, breezy, elegant.", href: "/collection/luxury-lawn" },
  { seed: "embroidered", label: "Embroidered", description: "Classic details, timeless appeal.", href: "/collection/embroidered" },
  { seed: "scarves-fav", label: "Scarves", description: "Versatile, stylish, essential.", href: "/scarves" },
  { seed: "ready-to-wear-fav", label: "Ready to Wear", description: "Modern cuts, graceful fits.", href: "/collection/ready-to-wear" },
  { seed: "dupattas-fav", label: "Dupattas", description: "Add the perfect layer.", href: "/dupattas" },
];

export function SeasonalFavorites() {
  return (
    <section className="container-page py-16 sm:py-20">
      <Reveal className="text-center">
        <h2 className="font-heading text-3xl sm:text-4xl">Seasonal Favorites</h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {FAVORITES.map((item, i) => (
          <Reveal key={item.label} delay={Math.min(i * 0.06, 0.3)}>
            <Link href={item.href} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-beige">
                <PlaceholderImage seed={item.seed} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="mt-3">
                <p className="text-[11px] font-medium tracking-[0.15em] text-muted-foreground uppercase">{item.label}</p>
                <p className="text-xs text-muted-foreground/80">{item.description}</p>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground">
                  Shop Now <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
