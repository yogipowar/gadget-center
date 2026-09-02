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

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Link href={routes.product(product.slug)} className="relative block">
        <ProductMedia accent={product.accent} name={product.name} />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
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

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </p>
          <Link href={routes.product(product.slug)} className="mt-1 block">
            <h3 className="text-sm font-semibold leading-snug text-foreground hover:underline">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">{conditionLabel(product)}</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{product.specs.join(" | ")}</p>
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-base font-semibold">{formatInr(product.salePrice, { compact: true })}</p>
            {discount > 0 ? (
              <>
                <p className="text-xs text-muted-foreground line-through">
                  {formatInr(product.price, { compact: true })}
                </p>
                <p className="text-xs font-medium text-emerald-700">{discount}% off</p>
              </>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Warranty: {product.warranty}</p>
          <p className="mt-1 text-xs font-medium">
            {product.inStock ? "In stock" : "Out of stock"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" disabled={!product.inStock} onClick={handleAdd}>
            Add to Cart
          </Button>
          <Link
            href={routes.product(product.slug)}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Buy Now
          </Link>
        </div>
        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full")}
          >
            Enquire
          </a>
        ) : (
          <Link
            href={`${routes.contact}?product=${product.slug}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full")}
          >
            Enquire
          </Link>
        )}
      </div>
    </article>
  );
}
