"use client";

import { useLeadCapture } from "@/components/lead/lead-capture-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:+91${digits.replace(/^91/, "")}`;
}

export function ContactPageClient() {
  const { openLeadCapture } = useLeadCapture();
  const whatsapp = buildWhatsAppUrl("Hi GadgetCenter, I would like to talk to your team.");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Laptops, computers, printers, UPS, CCTV, appliances, audio, robotics, or repair — tell us
        what you need.
      </p>
      <div className="mt-6 space-y-2 text-sm">
        <p>
          Orders:{" "}
          <a className="font-medium underline" href={telHref(siteConfig.contact.orderPhone)}>
            +91 {siteConfig.contact.orderPhone}
          </a>
        </p>
        <p>
          Repair:{" "}
          <a className="font-medium underline" href={telHref(siteConfig.contact.repairPhone)}>
            +91 {siteConfig.contact.repairPhone}
          </a>
        </p>
        <p>
          Email:{" "}
          <a className="font-medium underline" href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
        </p>
        <p className="text-muted-foreground">{siteConfig.contact.address}</p>
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
    </div>
  );
}
