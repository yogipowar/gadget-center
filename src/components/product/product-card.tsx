"use client";

import Link from "next/link";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProductMedia } from "@/components/product/product-media";
import { routes } from "@/config/routes";
import { addToCart } from "@/features/cart/store";
import { conditionLabel } from "@/features/catalog/queries";
import type { CatalogProduct } from "@/features/catalog/types";
import { buildWhatsAppUrl, productEnquiryMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { discountPercent, formatInr } from "@/utils/currency";

type ProductCardProps = {
  product: CatalogProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const discount = discountPercent(product.price, product.salePrice);
  const whatsapp = buildWhatsAppUrl(
    productEnquiryMessage({
      name: product.name,
      condition: product.condition === "REFURBISHED" ? "Refurbished" : "New",
      grade: product.grade === "A_PLUS" ? "Grade A+" : product.grade ? `Grade ${product.grade}` : undefined,
    }),
  );

  function handleAdd() {
    addToCart(product.slug);
    toast.success("Added to cart");
  }

  const meta = [
    product.condition === "REFURBISHED" ? conditionLabel(product) : null,
    product.warranty,
    product.inStock ? "In stock" : "Out of stock",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Link href={routes.product(product.slug)} className="relative block">
        <ProductMedia compact accent={product.accent} name={product.name} image={product.image} />
        <div className="absolute top-1.5 left-1.5">
          <Badge
            className={
              product.condition === "REFURBISHED"
                ? "bg-amber-600 text-white"
                : "bg-emerald-700 text-white"
            }
          >
            {product.condition === "REFURBISHED" ? "REFURBISHED" : "NEW"}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-2.5 sm:p-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </p>
          <Link href={routes.product(product.slug)} className="mt-0.5 block">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground hover:underline">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-1 text-[11px] leading-4 text-muted-foreground">
            {product.specs.join(" · ")}
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="text-sm font-semibold">{formatInr(product.salePrice, { compact: true })}</p>
            {discount > 0 ? (
              <>
                <p className="text-[11px] text-muted-foreground line-through">
                  {formatInr(product.price, { compact: true })}
                </p>
                <p className="text-[11px] font-medium text-emerald-700">{discount}% off</p>
              </>
            ) : null}
          </div>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">{meta}</p>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <Button size="xs" disabled={!product.inStock} onClick={handleAdd}>
            Add to Cart
          </Button>
          <Link
            href={routes.product(product.slug)}
            className={cn(buttonVariants({ variant: "outline", size: "xs" }))}
          >
            Buy Now
          </Link>
        </div>
        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "link", size: "xs" }), "h-auto px-0")}
          >
            Enquire
          </a>
        ) : (
          <Link
            href={`${routes.contact}?product=${product.slug}`}
            className={cn(buttonVariants({ variant: "link", size: "xs" }), "h-auto px-0")}
          >
            Enquire
          </Link>
        )}
      </div>
    </article>
  );
}
