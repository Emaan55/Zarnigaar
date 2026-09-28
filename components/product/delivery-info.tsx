import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function DeliveryInfo() {
  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-start gap-2.5">
          <Truck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-muted-foreground">Delivery in 3-7 business days across Pakistan.</p>
        </div>
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-muted-foreground">Cash on Delivery and secure online payment available.</p>
        </div>
        <div className="flex items-start gap-2.5">
          <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          <p className="text-xs text-muted-foreground">7-day easy returns on unused items.</p>
        </div>
      </div>

      <Accordion className="mt-6">
        <AccordionItem value="delivery">
          <AccordionTrigger className="text-sm">Delivery Information</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            We deliver across Pakistan with a flat shipping rate calculated at checkout. Orders are dispatched within
            1-2 business days and typically arrive within 3-7 business days depending on your city.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="payment">
          <AccordionTrigger className="text-sm">Cash on Delivery &amp; Online Payment</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            Pay with Cash on Delivery anywhere in Pakistan, or use secure online payment at checkout. We never store
            your card details.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="returns">
          <AccordionTrigger className="text-sm">Returns &amp; Exchanges</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            Unused items in original condition with tags attached can be returned within 7 days of delivery. Visit
            our FAQ page or contact us to start a return or exchange.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
