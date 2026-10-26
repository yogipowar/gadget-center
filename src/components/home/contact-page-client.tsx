"use client";

import Link from "next/link";

import { useLeadCapture } from "@/components/lead/lead-capture-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { legal } from "@/config/legal";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { formatPhone, telHref } from "@/lib/contact";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function ContactPageClient() {
  const { openLeadCapture } = useLeadCapture();
  const whatsapp = buildWhatsAppUrl("Hi GadgetCenter, I would like to talk to your team.");
  const orderPhone = formatPhone(siteConfig.contact.orderPhone);
  const repairPhone = formatPhone(siteConfig.contact.repairPhone);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Contact Us</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {legal.businessName} is a computer and electronics shop in Kolhapur. Use these details for orders,
        repairs, installation bookings and payment questions.
      </p>

      <div className="mt-6 space-y-3 rounded-xl border border-border p-5 text-sm leading-6">
        <p className="font-semibold text-foreground">{legal.businessName}</p>
        <p>
          <span className="font-medium">Address: </span>
          {siteConfig.contact.address}
        </p>
        <p>
          <span className="font-medium">Orders &amp; sales: </span>
          <a className="underline" href={telHref(siteConfig.contact.orderPhone)}>
            {orderPhone}
          </a>
        </p>
        <p>
          <span className="font-medium">Repair &amp; service: </span>
          <a className="underline" href={telHref(siteConfig.contact.repairPhone)}>
            {repairPhone}
          </a>
        </p>
        <p>
          <span className="font-medium">Email: </span>
          <a className="underline" href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
        </p>
        {whatsapp ? (
          <p>
            <span className="font-medium">WhatsApp: </span>
            <a className="underline" href={whatsapp} target="_blank" rel="noopener noreferrer">
              {orderPhone}
            </a>
          </p>
        ) : null}
        <p>
          <span className="font-medium">Hours: </span>
          {legal.hours}. {legal.closed}.
        </p>
        <p>
          <span className="font-medium">Website: </span>
          <a className="underline" href="https://gadgetcenter.in">
            https://gadgetcenter.in
          </a>
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button className="h-10 px-4" onClick={openLeadCapture}>
          Get Expert Help
        </Button>
        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "h-10 px-4")}
          >
            Chat on WhatsApp
          </a>
        ) : null}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Policies:{" "}
        <Link href={routes.privacyPolicy} className="underline">
          Privacy
        </Link>
        ,{" "}
        <Link href={routes.terms} className="underline">
          Terms &amp; Conditions
        </Link>
        ,{" "}
        <Link href={routes.refundPolicy} className="underline">
          Refund &amp; Cancellation
        </Link>
        ,{" "}
        <Link href={routes.shippingPolicy} className="underline">
          Shipping
        </Link>
        .
      </p>
    </div>
  );
}
