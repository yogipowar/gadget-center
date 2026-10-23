import { ExpertHelpButton } from "@/components/lead/expert-help-button";
import { buttonVariants } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function HomeContactCta() {
  const whatsapp = buildWhatsAppUrl("Hi GadgetCenter, I need help choosing a laptop.");

  return (
    <section className="border-y border-border bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 py-8 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-brand-navy">Need help choosing?</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Share your budget and use-case. Our team will suggest new or refurbished options without
            overselling.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ExpertHelpButton className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>
            Find My Laptop
          </ExpertHelpButton>
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5")}
            >
              WhatsApp Us
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
