"use client";

import Link from "next/link";
import { Headset, Mail, Phone, Truck } from "lucide-react";

import { ProductBuyBox } from "@/components/product/product-buy-box";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { Badge } from "@/components/ui/badge";
import { REFURBISHED_GRADE_LABELS } from "@/constants/products";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { useAdminCatalog } from "@/features/admin/catalog-store";
import {
  getProductBySlug,
  productFacts,
  productGallery,
  relatedProducts,
  shopCategories,
} from "@/features/catalog/queries";
import { formatInr, discountPercent } from "@/utils/currency";

function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:+91${digits.replace(/^91/, "")}`;
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").replace(/^91/, "");
  return `+91 ${digits}`;
}

function SpecRow({ label, value }: { label: string; value: string }) {
  if (!value) {
    return null;
  }
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-1.5 text-sm sm:grid-cols-[160px_1fr]">
      <dt className="font-medium text-zinc-800">{label}</dt>
      <dd className="text-zinc-600">{value}</dd>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  if (!value) {
    return null;
  }
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-zinc-800">{value}</p>
    </div>
  );
}

export function ProductDetailClient({ slug }: { slug: string }) {
  const catalog = useAdminCatalog();
  const product = getProductBySlug(slug, catalog.products);

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This listing is not in the catalog saved on this device.
        </p>
      </div>
    );
  }

  const discount = discountPercent(product.price, product.salePrice);
  const related = relatedProducts(product, catalog.products);
  const relatedCategory = shopCategories.find((item) => item.slug === product.categorySlug);
  const facts = productFacts(product);
  const onHand = catalog.inventory.find((row) => row.id === product.id)?.onHand ?? product.onHand ?? 0;
  const phone = siteConfig.contact.orderPhone;
  const email = siteConfig.contact.email;
  const moreInfo = [
    { label: "SKU", value: facts.sku },
    { label: "Brand", value: facts.brand },
    { label: "Model No.", value: facts.model },
    { label: "Processor", value: facts.processor },
    { label: "RAM", value: facts.ram },
    { label: "Hard Disk Drive (Storage)", value: facts.storageCapacity },
    { label: "Storage Type", value: facts.storageType },
    { label: "Screen Size", value: facts.screenSize },
    { label: "Touch Screen", value: facts.touchScreen ? "Yes" : "No" },
    { label: "Adapter", value: facts.adapterIncluded ? "Included" : "" },
    { label: "Condition", value: facts.condition },
    { label: "Warranty", value: facts.warranty || "Ask before booking" },
  ];

  return (
    <div className="bg-white text-zinc-900">
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="grid gap-8 overflow-visible lg:grid-cols-2">
        <ProductGallery
          key={product.id}
          images={productGallery(product)}
          name={product.name}
          accent={product.accent}
        />
        <div>
          <div className="mt-0 flex flex-wrap gap-2">
            <Badge>
              {product.condition === "REFURBISHED" ? "REFURBISHED" : product.condition === "USED" ? "USED" : "NEW"}
            </Badge>
            {product.condition === "REFURBISHED" && product.grade ? (
              <Badge variant="outline">Grade {REFURBISHED_GRADE_LABELS[product.grade]}</Badge>
            ) : null}
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <p className="text-3xl font-semibold">{formatInr(product.salePrice, { compact: true })}</p>
            {discount > 0 ? (
              <>
                <p className="text-sm text-muted-foreground line-through">
                  {formatInr(product.price, { compact: true })}
                </p>
                <p className="text-sm font-medium text-brand-blue">{discount}% off</p>
              </>
            ) : null}
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Availability</p>
            {product.inStock && onHand > 0 && onHand <= 5 ? (
              <p className="mt-1 text-sm font-semibold text-red-600">
                Hurry, only {onHand} left
              </p>
            ) : product.inStock ? (
              <p className="mt-1 text-sm font-medium text-emerald-700">In stock</p>
            ) : (
              <p className="mt-1 text-sm font-medium text-red-600">Out of stock</p>
            )}
          </div>

          <dl className="mt-5 border-y border-border py-3">
            <SpecRow label="Processor" value={facts.processor} />
            <SpecRow label="RAM" value={facts.ram} />
            <SpecRow
              label="Storage Capacity"
              value={[facts.storageCapacity, facts.storageType].filter(Boolean).join(" ")}
            />
            <SpecRow label="Screen Size" value={facts.screenSize} />
          </dl>

          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            {facts.adapterIncluded ? <li>Adapter included</li> : null}
            <li>Pan India sales and support</li>
            {facts.warranty ? <li>{facts.warranty}</li> : <li>Warranty: ask before booking</li>}
          </ul>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-sm font-semibold text-zinc-900">For placing your order please contact us on</p>
            <p className="mt-2 flex items-center gap-2 text-sm">
              <Phone className="size-4 text-brand-blue" />
              <span className="font-medium">Contact</span>
              <a className="text-brand-blue hover:underline" href={telHref(phone)}>
                {formatPhone(phone)}
              </a>
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-sm">
              <Mail className="size-4 text-brand-blue" />
              <span className="font-medium">Email</span>
              <a className="text-brand-blue hover:underline" href={`mailto:${email}`}>
                {email}
              </a>
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-6 border-t border-border pt-4">
            <div className="flex items-center gap-2 text-sm text-zinc-800">
              <Truck className="size-8 text-brand-blue" strokeWidth={1.5} />
              <span>
                Free
                <br />
                Shipping
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-800">
              <Headset className="size-8 text-brand-blue" strokeWidth={1.5} />
              <span>
                Online
                <br />
                Support
              </span>
            </div>
          </div>

          <div className="mt-6">
            <ProductBuyBox product={product} />
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="w-fit border-b-2 border-brand-navy pb-1 text-sm font-semibold uppercase tracking-wide text-brand-navy">
          More information
        </h2>
        <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {moreInfo.map((item) => (
            <InfoCell key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Related products</h2>
            <Link
              href={relatedCategory?.href ?? routes.products}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              View all
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </div>
    </div>
  );
}
