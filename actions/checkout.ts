"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { placeOrderSchema, type CheckoutInput } from "@/lib/validation/checkout";
import { calculateDiscountAmount, calculateShipping } from "@/lib/pricing";
import { generateOrderNumber } from "@/lib/format";
import { getPaymentProvider } from "@/lib/payments";
import type { CartLine } from "@/types/cart";

export interface PlaceOrderResult {
  ok: boolean;
  message?: string;
  orderNumber?: string;
}

export async function placeOrder(
  customer: CheckoutInput,
  cartLines: CartLine[],
  couponCode: string | null
): Promise<PlaceOrderResult> {
  const parsed = placeOrderSchema.safeParse({
    customer,
    lines: cartLines.map((l) => ({
      productId: l.productId,
      size: l.size,
      color: l.color,
      quantity: l.quantity,
    })),
    couponCode,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid order details." };
  }

  const admin = createAdminClient();

  // Re-price everything server-side — never trust client-submitted prices.
  const productIds = [...new Set(cartLines.map((l) => l.productId))];
  const { data: products, error: productsError } = await admin
    .from("products")
    .select("id, name, price, sale_price, stock, status")
    .in("id", productIds);

  if (productsError || !products || products.length !== productIds.length) {
    return { ok: false, message: "Some items in your bag are no longer available." };
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const orderItems: {
    product_id: string;
    name: string;
    image: string;
    price: number;
    size: string | null;
    color: string | null;
    quantity: number;
    line_total: number;
  }[] = [];

  for (const line of cartLines) {
    const product = productMap.get(line.productId);
    if (!product || product.status !== "active") {
      return { ok: false, message: `${line.name} is no longer available.` };
    }
    if (product.stock < line.quantity) {
      return { ok: false, message: `Only ${product.stock} left in stock for ${line.name}.` };
    }
    const price = product.sale_price !== null ? Number(product.sale_price) : Number(product.price);
    orderItems.push({
      product_id: product.id,
      name: product.name,
      image: line.image,
      price,
      size: line.size,
      color: line.color,
      quantity: line.quantity,
      line_total: price * line.quantity,
    });
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.line_total, 0);

  let discountAmount = 0;
  let appliedDiscountId: string | null = null;
  let appliedDiscountCode: string | null = null;

  if (couponCode) {
    const { data: discount } = await admin
      .from("discounts")
      .select("*")
      .eq("code", couponCode.trim().toUpperCase())
      .eq("active", true)
      .maybeSingle();

    if (discount) {
      const now = new Date();
      const withinWindow =
        (!discount.starts_at || new Date(discount.starts_at) <= now) &&
        (!discount.ends_at || new Date(discount.ends_at) >= now);
      const withinLimit = discount.usage_limit === null || discount.used_count < discount.usage_limit;

      if (withinWindow && withinLimit && subtotal >= discount.min_order) {
        discountAmount = calculateDiscountAmount(
          { type: discount.type, value: Number(discount.value) },
          subtotal
        );
        appliedDiscountId = discount.id;
        appliedDiscountCode = discount.code;
      }
    }
  }

  const shipping = calculateShipping(subtotal);
  const total = Math.max(subtotal - discountAmount, 0) + shipping;

  try {
    // A real online gateway would return a redirect URL here for the
    // client to follow to a hosted checkout page; COD resolves immediately.
    await getPaymentProvider(customer.paymentMethod).init({
      orderId: "",
      orderNumber: "",
      amount: total,
      customerEmail: customer.email,
      customerPhone: customer.phone,
    });
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Payment could not be initialized." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const orderNumber = generateOrderNumber();
  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user?.id ?? null,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      address: customer.address,
      city: customer.city,
      province: customer.province,
      postal_code: customer.postalCode,
      payment_method: customer.paymentMethod,
      // COD and the stubbed online provider both resolve here as "confirmed"
      // (order placed); a real gateway's redirect flow would instead mark
      // this "paid" only after its webhook/callback confirms payment.
      payment_status: "pending",
      subtotal,
      shipping,
      discount_total: discountAmount,
      total,
      discount_code: appliedDiscountCode,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { ok: false, message: "Could not place your order. Please try again." };
  }

  const { error: itemsError } = await admin
    .from("order_items")
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) {
    await admin.from("orders").delete().eq("id", order.id);
    return { ok: false, message: "Could not place your order. Please try again." };
  }

  await Promise.all(
    orderItems.map((item) => {
      const product = productMap.get(item.product_id)!;
      const nextStock = product.stock - item.quantity;
      return admin
        .from("products")
        .update({ stock: nextStock, is_sold_out: nextStock <= 0 })
        .eq("id", item.product_id);
    })
  );

  if (appliedDiscountId) {
    const { data: discountRow } = await admin
      .from("discounts")
      .select("used_count")
      .eq("id", appliedDiscountId)
      .single();
    await admin
      .from("discounts")
      .update({ used_count: (discountRow?.used_count ?? 0) + 1 })
      .eq("id", appliedDiscountId);
    await admin.from("discount_usages").insert({
      discount_id: appliedDiscountId,
      order_id: order.id,
      user_id: user?.id ?? null,
    });
  }

  return { ok: true, orderNumber };
}
