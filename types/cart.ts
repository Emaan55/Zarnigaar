export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string | null;
  color: string | null;
  quantity: number;
  stock: number;
}

export interface WishlistLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  salePrice: number | null;
}
