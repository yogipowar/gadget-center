import { legal } from "@/config/legal";
import { siteConfig } from "@/config/site";
import { formatPhone, telHref } from "@/lib/contact";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function BusinessContact({ heading = "Business contact" }: { heading?: string }) {
  const whatsapp = buildWhatsAppUrl("Hi GadgetCenter, I have a question about an order.");
  const phone = formatPhone(siteConfig.contact.orderPhone);

  return (
    <section className="rounded-xl border border-border p-4 text-sm leading-6 text-foreground">
      <h2 className="text-base font-semibold">{heading}</h2>
      <p className="mt-2">{legal.businessName}</p>
      <p className="mt-1 text-muted-foreground">{siteConfig.contact.address}</p>
      <p className="mt-2">
        Phone:{" "}
        <a className="font-medium underline" href={telHref(siteConfig.contact.orderPhone)}>
          {phone}
        </a>
      </p>
      <p>
        Email:{" "}
        <a className="font-medium underline" href={`mailto:${siteConfig.contact.email}`}>
          {siteConfig.contact.email}
        </a>
      </p>
      {whatsapp ? (
        <p>
          WhatsApp:{" "}
          <a className="font-medium underline" href={whatsapp} target="_blank" rel="noopener noreferrer">
            {phone}
          </a>
        </p>
      ) : null}
      <p className="mt-2 text-muted-foreground">
        {legal.hours}. {legal.closed}.
      </p>
    </section>
  );
}
