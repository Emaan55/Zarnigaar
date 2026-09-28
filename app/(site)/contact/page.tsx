import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/shop/page-header";
import { ContactForm } from "@/components/shop/contact-form";
import { InstagramIcon, FacebookIcon } from "@/components/shared/social-icons";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact Us" description="We'd love to hear from you." />
      <div className="container-page grid gap-14 py-14 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-xl">Get in Touch</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            For order queries, sizing help or anything else, reach out and our team will respond within 1-2 business
            days.
          </p>

          <ul className="mt-6 flex flex-col gap-4 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              <a href="mailto:hello@zarnigaar.example" className="hover:underline">
                hello@zarnigaar.example
              </a>
            </li>
            <li className="flex items-center gap-3">
              <InstagramIcon className="h-4 w-4" />
              <a href="#" className="hover:underline">
                @zarnigaar
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FacebookIcon className="h-4 w-4" />
              <a href="#" className="hover:underline">
                /zarnigaar
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-xl">Send a Message</h2>
          <div className="mt-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
