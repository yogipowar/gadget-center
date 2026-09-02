import type { Metadata } from "next";

import { ContactPageClient } from "@/components/home/contact-page-client";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to GadgetCenter about new and refurbished laptops, desktops and accessories.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
