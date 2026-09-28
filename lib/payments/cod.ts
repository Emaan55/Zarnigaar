import type { PaymentProvider } from "./types";

export const codProvider: PaymentProvider = {
  id: "cod",
  label: "Cash on Delivery",
  async init() {
    // Nothing to do upstream — the order is placed immediately and
    // marked payment_status "pending" until delivery.
    return { status: "confirmed" };
  },
};
