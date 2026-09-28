"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[78vh] min-h-[520px] w-full">
        <PlaceholderImage seed="zarnigaar-hero" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-ink/5 to-transparent" />

        <div className="container-page absolute inset-0 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg"
          >
            <p className="text-xs font-medium tracking-[0.25em] text-ink/70">NEW COLLECTION</p>
            <h1 className="mt-4 font-heading text-5xl leading-[1.05] text-ink sm:text-6xl">
              Timeless Elegance, Everyday.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/75">
              Effortless silhouettes, premium fabrics and signature scarves for the modern woman.
            </p>
            <Button
              size="lg"
              className="mt-7 rounded-none px-7"
              render={
                <Link href="/new-in" className="inline-flex items-center gap-2">
                  Shop New Arrivals <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              }
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
