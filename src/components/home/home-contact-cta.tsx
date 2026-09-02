"use client";

import { useLeadCapture } from "@/components/lead/lead-capture-provider";
import { buttonVariants } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function HomeContactCta() {
  const { openLeadCapture } = useLeadCapture();
  const whatsapp = buildWhatsAppUrl("Hi GadgetCenter, I need help choosing a laptop.");

  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Need help choosing?</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-background/75">
            Share your budget and use-case. Our team will suggest new or refurbished options without
            overselling.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={openLeadCapture}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 bg-background px-5 text-foreground hover:bg-background/90",
            )}
          >
            Find My Laptop
          </button>
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-background/30 px-5 text-background hover:bg-background/10 hover:text-background",
              )}
            >
              WhatsApp Us
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
