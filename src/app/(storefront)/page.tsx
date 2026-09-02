import Link from "next/link";
import { BadgeCheck, Cpu, IndianRupee, ShieldCheck, Wrench } from "lucide-react";

import { HomeContactCta } from "@/components/home/home-contact-cta";
import { HomeFaq } from "@/components/home/home-faq";
import { HomeHero } from "@/components/home/home-hero";
import { HomeLeadGate } from "@/components/lead/lead-capture-provider";
import { ProductGrid } from "@/components/product/product-grid";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import {
  budgetBands,
  laptopBrands,
  pickDiverseCatalog,
  queryCatalog,
  shopCategories,
} from "@/features/catalog/queries";
import { cn } from "@/lib/utils";

function SectionHeading({
  title,
  href,
  action,
}: {
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {href ? (
        <Link href={href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
          {action ?? "View all"}
        </Link>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  const featured = pickDiverseCatalog(queryCatalog({ featured: true }), 8);
  const arrivals = pickDiverseCatalog(queryCatalog({ newArrival: true }), 8);
  const refurbished = pickDiverseCatalog(queryCatalog({ refurbished: true }), 8);
  const bestLaptops = queryCatalog({ productType: "LAPTOP", bestseller: true }).slice(0, 4);

  return (
    <div className="flex flex-col gap-10 pb-16">
      <HomeLeadGate />
      <HomeHero />

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading title="Shop by category" href={routes.products} action="All products" />
        <div className="flex flex-wrap gap-2">
          {shopCategories.map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              className="rounded-full border border-border px-3.5 py-1.5 text-sm hover:bg-muted"
            >
              {category.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading title="Featured products" href={routes.products} />
        <ProductGrid products={featured} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading title="New arrivals" href={routes.products} />
        <ProductGrid products={arrivals} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading title="Refurbished deals" href={routes.refurbishedLaptops} />
        <ProductGrid products={refurbished} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading title="Best selling laptops" href={routes.laptops} />
        <ProductGrid products={bestLaptops} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading title="Laptop by brand" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {laptopBrands.map((brand) => (
            <Link
              key={brand}
              href={`${routes.products}?brand=${encodeURIComponent(brand)}`}
              className="rounded-xl border border-border px-4 py-5 text-center text-sm font-medium hover:bg-muted/50"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading title="Shop by budget" />
        <div className="flex gap-3 overflow-x-auto pb-1">
          {budgetBands.map((band) => {
            const params = new URLSearchParams();
            if (band.minPrice) {
              params.set("minPrice", String(band.minPrice));
            }
            if (band.maxPrice) {
              params.set("maxPrice", String(band.maxPrice));
            }
            return (
              <Link
                key={band.label}
                href={`${routes.products}?${params.toString()}`}
                className="shrink-0 rounded-full border border-border px-4 py-2 text-sm hover:bg-muted"
              >
                {band.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading title="Refurbished advantage" href={routes.refurbishedLaptops} action="Shop refurbished" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: BadgeCheck, title: "Tested devices", text: "Key functions are checked before a laptop is listed." },
            { icon: ShieldCheck, title: "Quality checked", text: "Condition grade is shown on the product, not hidden in fine print." },
            { icon: IndianRupee, title: "Affordable pricing", text: "Business-class machines at a lower price than equivalent new models." },
            { icon: Wrench, title: "Warranty options", text: "Warranty is taken from the product record. We do not invent cover." },
            { icon: Cpu, title: "Reliable performance", text: "Core i5 / Ryzen office laptops suited to Excel, browsing and calls." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border p-4">
              <item.icon className="size-5 text-foreground" />
              <p className="mt-3 text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading title="Why choose GadgetCenter" />
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-border p-5">
            <p className="text-sm font-semibold">Clear condition</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              New and refurbished stock are labelled separately. Refurbished listings show grade
              where we have it.
            </p>
          </div>
          <div className="rounded-xl border border-border p-5">
            <p className="text-sm font-semibold">Honest specifications</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Processor, RAM and storage are taken from the catalog. If a spec is missing, we leave
              it blank instead of guessing.
            </p>
          </div>
          <div className="rounded-xl border border-border p-5">
            <p className="text-sm font-semibold">Help before you buy</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Talk to the team on WhatsApp or through the help form if you are unsure between new
              and refurbished.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading title="Customer reviews" />
        <div className="rounded-xl border border-dashed border-border px-4 py-8 text-sm text-muted-foreground">
          GadgetCenter publishes only verified buyer reviews. None are listed yet, so this section
          stays empty rather than showing placeholder ratings.
        </div>
      </section>

      <HomeFaq />
      <HomeContactCta />

      <div className="mx-auto flex w-full max-w-6xl justify-center px-4">
        <Link href={routes.contact} className={cn(buttonVariants({ variant: "outline" }))}>
          Contact GadgetCenter
        </Link>
      </div>
    </div>
  );
}
