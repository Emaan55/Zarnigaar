import type { Metadata } from "next";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { Reveal } from "@/components/shared/reveal";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        <PlaceholderImage seed="about-hero" className="h-full w-full" />
        <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
          <h1 className="font-heading text-4xl text-cream sm:text-5xl">Our Story</h1>
        </div>
      </section>

      <div className="container-page max-w-3xl py-16">
        <Reveal>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Zarnigaar was founded on a simple belief: that everyday clothing can carry the weight of tradition
            without losing its ease. Rooted in Pakistan&apos;s rich textile heritage, our name, drawn from the art of
            fine embroidery, reflects our commitment to craftsmanship in every piece we create.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10" id="craftsmanship">
          <h2 className="font-heading text-2xl">Craftsmanship</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Every Zarnigaar piece begins with fabric sourced for its quality and finished by artisans who carry
            generations of embroidery and weaving knowledge. From hand-finished necklines to signature scarf prints,
            we treat every detail as an opportunity for quality, not just decoration.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <h2 className="font-heading text-2xl">Pakistani Textile Heritage</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Pakistan&apos;s textile tradition spans centuries of lawn weaving, block printing and embroidery. We draw on
            this heritage while designing for how women actually dress today: effortless silhouettes that move
            easily from morning to evening.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <h2 className="font-heading text-2xl">Quality &amp; Timeless Fashion</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            We design for longevity, not trend cycles. Our lawn suits, embroidered pieces and signature scarves are
            built to be worn for seasons, not weeks, an approach to fashion that respects both the maker and the
            wearer.
          </p>
        </Reveal>

        <Reveal delay={0.25} className="mt-10">
          <h2 className="font-heading text-2xl">Clothing &amp; Scarves</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            From ready-to-wear lawn and embroidered suits to our signature scarf collection, every Zarnigaar product
            is designed to work together, a considered wardrobe rather than a collection of one-off pieces.
          </p>
        </Reveal>
      </div>
    </>
  );
}
