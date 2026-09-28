export type ProductCategory = "clothing" | "scarves" | "dupattas" | "accessories";

export type ProductBadge = "new" | "sale" | "sold-out" | null;

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  sku: string;
  stock: number;
  category: ProductCategory;
  collectionSlugs: string[];
  sizes: string[];
  colors: string[];
  isNew: boolean;
  isFeatured: boolean;
  isSoldOut: boolean;
  images: ProductImage[];
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
