import type { PaymentProvider } from "./types";

// Placeholder for a Pakistan-compatible gateway (JazzCash, Easypaisa,
// HBL PayFast, etc). Swap the body of `init` for the real hosted-checkout
// call and it plugs into checkout/order flow with no other changes —
// nothing upstream stores card data, only this provider talks to the
// gateway, and it only ever returns a redirect URL or throws.
export const onlineProvider: PaymentProvider = {
  id: "online",
  label: "Secure Online Payment",
  async init() {
    throw new Error(
      "Online payments are not configured yet. Choose Cash on Delivery, or add a gateway integration in lib/payments/online-stub.ts."
    );
  },
};
