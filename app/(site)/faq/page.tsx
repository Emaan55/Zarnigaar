import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getFaqs } from "@/data/faqs";

export const metadata: Metadata = { title: "FAQ" };

const CATEGORY_LABELS: Record<string, string> = {
  orders: "Orders",
  shipping: "Shipping",
  cod: "Cash on Delivery",
  payments: "Online Payments",
  returns: "Returns",
  exchanges: "Exchanges",
  sizing: "Size Guide",
  products: "Products",
  general: "General",
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    (acc[faq.category] ??= []).push(faq);
    return acc;
  }, {});

  return (
    <>
      <PageHeader title="Frequently Asked Questions" description="Everything you need to know about ordering from Zarnigaar." />
      <div className="container-page max-w-3xl py-14">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">FAQs coming soon.</p>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} id={category} className="mb-10 scroll-mt-24">
              <h2 className="font-heading text-xl">{CATEGORY_LABELS[category] ?? category}</h2>
              <Accordion className="mt-3">
                {items.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-sm">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        )}
      </div>
    </>
  );
}
