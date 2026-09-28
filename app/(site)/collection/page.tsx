import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shop/page-header";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { getCollections } from "@/data/collections";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <PageHeader title="Collections" description="Curated edits from Zarnigaar." />
      <div className="container-page py-14">
        {collections.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No collections yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/collection/${collection.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-beige">
                  <PlaceholderImage seed={collection.slug} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h2 className="mt-4 font-heading text-xl">{collection.name}</h2>
                {collection.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{collection.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
