import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import type { Deal } from "@/types/catalog";

function PromoTile({
  seed,
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  dark,
  className,
}: {
  seed: string;
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={ctaHref}
      className={`group relative block h-full min-h-[280px] overflow-hidden ${className ?? ""}`}
    >
      <PlaceholderImage seed={seed} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
      <div className={`absolute inset-0 ${dark ? "bg-ink/45" : "bg-gradient-to-t from-ink/55 via-ink/10 to-transparent"}`} />
      <div className="absolute inset-0 flex flex-col justify-end p-7">
        {eyebrow && <p className="text-[11px] font-medium tracking-[0.2em] text-cream/80">{eyebrow}</p>}
        <h3 className="mt-1 font-heading text-2xl text-cream sm:text-3xl">{title}</h3>
        <p className="mt-2 max-w-xs text-sm text-cream/85">{description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cream underline-offset-4 group-hover:underline">
          {ctaLabel} <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </span>
      </div>
    </Link>
  );
}

export function EditorialGrid({ deal }: { deal: Deal | null }) {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <Reveal className="h-full">
          <PromoTile
            seed="premium-scarves"
            title="Premium Scarves"
            description="Add a touch of sophistication to every look."
            ctaLabel="Shop Scarves"
            ctaHref="/scarves"
            className="h-full min-h-[400px]"
          />
        </Reveal>

        <div className="flex flex-col gap-4">
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <Reveal delay={0.1}>
              <PromoTile
                seed="ready-to-wear"
                title="Ready to Wear"
                description="Comfort meets elegance in every piece."
                ctaLabel="Shop Now"
                ctaHref="/women"
                className="h-full"
              />
            </Reveal>
            <Reveal delay={0.15}>
              <PromoTile
                seed="accessories"
                title="Accessories"
                description="The finishing touch to your style."
                ctaLabel="Shop Accessories"
                ctaHref="/collection"
                className="h-full"
              />
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="relative flex min-h-[180px] items-center overflow-hidden bg-ink">
              <PlaceholderImage seed="sale-banner" className="absolute inset-0 h-full w-full opacity-40" />
              <div className="relative flex w-full flex-col items-start gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-heading text-2xl text-cream sm:text-3xl">{deal?.title ?? "Flat 20% Off"}</h3>
                  <p className="mt-2 max-w-sm text-sm text-cream/80">
                    {deal?.description ?? "On selected items. Limited time only."}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-none px-7"
                  render={<Link href={deal?.ctaHref ?? "/new-in"}>{deal?.ctaLabel ?? "Shop Now"}</Link>}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
