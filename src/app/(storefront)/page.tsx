import Link from "next/link";
import { BadgeCheck, Cpu, IndianRupee, ShieldCheck, Wrench } from "lucide-react";

import { HomeContactCta } from "@/components/home/home-contact-cta";
import { HomeFaq } from "@/components/home/home-faq";
import { HomeHero } from "@/components/home/home-hero";
import { HomeRequirementForm } from "@/components/home/home-requirement-form";
import { ProductGrid } from "@/components/product/product-grid";
import { routes } from "@/config/routes";
import {
  budgetBands,
  categoryHref,
  laptopBrands,
  pickDiverseCatalog,
  queryCatalog,
} from "@/features/catalog/queries";
import { loadCatalog, loadCategories } from "@/lib/catalog-server";

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
    <div className="mb-4 flex items-end justify-between gap-3 border-b border-border pb-2">
      <h2 className="text-lg font-semibold text-brand-navy">{title}</h2>
      {href ? (
        <Link href={href} className="text-sm text-brand-blue hover:underline">
          {action ?? "View all"}
        </Link>
      ) : null}
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories] = await Promise.all([loadCatalog(), loadCategories()]);
  const featured = pickDiverseCatalog(queryCatalog({ featured: true }, products), 8);
  const arrivals = pickDiverseCatalog(queryCatalog({ newArrival: true }, products), 8);
  const refurbished = pickDiverseCatalog(queryCatalog({ refurbished: true }, products), 8);
  const bestLaptops = queryCatalog({ productType: "LAPTOP", bestseller: true }, products).slice(0, 4);
  const liveCategories = categories.filter(
    (category) =>
      category.live && queryCatalog({ categorySlug: category.slug }, products).length > 0,
  );

  return (
    <div className="flex flex-col gap-10 pb-16">
      <HomeHero />

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading title="Shop by category" href={routes.products} action="All products" />
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {liveCategories.map((category) => (
            <Link
              key={category.slug}
              href={categoryHref(category.slug)}
              className="text-sm text-zinc-800 hover:text-brand-blue hover:underline"
            >
              {category.name}
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
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {laptopBrands.map((brand) => (
            <Link
              key={brand}
              href={`${routes.products}?brand=${encodeURIComponent(brand)}`}
              className="text-sm font-medium text-zinc-800 hover:text-brand-blue hover:underline"
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
                className="shrink-0 text-sm text-zinc-800 hover:text-brand-blue hover:underline"
              >
                {band.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <SectionHeading title="Refurbished advantage" href={routes.refurbishedLaptops} action="Shop refurbished" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: BadgeCheck, title: "Tested devices", text: "Key functions are checked before a laptop is listed." },
            { icon: ShieldCheck, title: "Quality checked", text: "Every listing is labelled refurbished. Grade is shown only when we have it." },
            { icon: IndianRupee, title: "Affordable pricing", text: "Business-class machines at a lower price than equivalent new models." },
            { icon: Wrench, title: "Warranty options", text: "Warranty is taken from the product record. We do not invent cover." },
            { icon: Cpu, title: "Reliable performance", text: "Dell and HP business laptops suited to Excel, browsing and calls." },
          ].map((item) => (
            <div key={item.title}>
              <item.icon className="size-4 text-brand-navy" />
              <p className="mt-2 text-sm font-medium text-zinc-900">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <HomeRequirementForm />
      <HomeFaq />
      <HomeContactCta />
    </div>
  );
}
