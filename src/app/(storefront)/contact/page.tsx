import type { Metadata } from "next";

import { ContactPageClient } from "@/components/home/contact-page-client";
import { legal } from "@/config/legal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Call, email or visit GadgetCenter in Kolhapur. Phone ${siteConfig.contact.orderPhone}, ${siteConfig.contact.email}. ${legal.hours}.`,
};

export default function ContactPage() {
  return <ContactPageClient />;
}
