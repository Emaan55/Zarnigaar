import type { Tables } from "@/types/database";
import type { Category, Collection, Deal, FaqItem, Product, ProductCategory } from "@/types/catalog";

type ProductRow = Tables<"products"> & {
  product_images?: Pick<Tables<"product_images">, "id" | "url" | "alt" | "position">[] | null;
  categories?: Pick<Tables<"categories">, "slug"> | null;
  collection_products?: { collections: Pick<Tables<"collections">, "slug"> | null }[] | null;
};

export function mapProduct(row: ProductRow): Product {
  const images = (row.product_images ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((img) => ({ id: img.id, url: img.url, alt: img.alt, position: img.position }));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    salePrice: row.sale_price !== null ? Number(row.sale_price) : null,
    sku: row.sku,
    stock: row.stock,
    category: (row.categories?.slug as ProductCategory) ?? "clothing",
    collectionSlugs:
      row.collection_products?.map((cp) => cp.collections?.slug).filter((s): s is string => !!s) ?? [],
    sizes: row.sizes,
    colors: row.colors,
    isNew: row.is_new,
    isFeatured: row.is_featured,
    isSoldOut: row.is_sold_out || row.stock <= 0,
    images,
    createdAt: row.created_at,
  };
}

export function mapCategory(row: Tables<"categories">): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    imageUrl: row.image_url ?? "",
  };
}

export function mapCollection(row: Tables<"collections">): Collection {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    imageUrl: row.image_url ?? "",
  };
}

export function mapDeal(row: Tables<"deals">): Deal {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    imageUrl: row.image_url ?? "",
    ctaLabel: row.cta_label ?? "Shop Now",
    ctaHref: row.cta_href ?? "/",
    startsAt: row.starts_at ?? "",
    endsAt: row.ends_at ?? "",
    active: row.active,
  };
}

export function mapFaq(row: Tables<"faqs">): FaqItem {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
  };
}
