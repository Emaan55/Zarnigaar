export interface PaymentContext {
  orderId: string;
  orderNumber: string;
  amount: number;
  customerEmail: string;
  customerPhone: string;
}

export interface PaymentInitResult {
  /** "confirmed" for methods that need no further step (COD); "redirect"
   * for gateways that hand off to a hosted checkout page. */
  status: "confirmed" | "redirect";
  redirectUrl?: string;
}

export interface PaymentProvider {
  id: "cod" | "online";
  label: string;
  init(context: PaymentContext): Promise<PaymentInitResult>;
}
