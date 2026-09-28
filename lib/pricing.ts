export const FREE_SHIPPING_THRESHOLD = 10000;
export const FLAT_SHIPPING_RATE = 250;

export function calculateShipping(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
}

interface DiscountLike {
  type: "percentage" | "fixed";
  value: number;
}

export function calculateDiscountAmount(discount: DiscountLike, subtotal: number) {
  const amount = discount.type === "percentage" ? (subtotal * discount.value) / 100 : discount.value;
  return Math.min(amount, subtotal);
}
