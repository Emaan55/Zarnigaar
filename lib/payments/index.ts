import { codProvider } from "./cod";
import { onlineProvider } from "./online-stub";
import type { PaymentProvider } from "./types";

const providers: Record<string, PaymentProvider> = {
  cod: codProvider,
  online: onlineProvider,
};

export function getPaymentProvider(id: string): PaymentProvider {
  const provider = providers[id];
  if (!provider) throw new Error(`Unknown payment method: ${id}`);
  return provider;
}

export type { PaymentProvider, PaymentContext, PaymentInitResult } from "./types";
