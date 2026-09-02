"use client";

import { ProductBuyBox } from "@/components/product/product-buy-box";
import { ProductMedia } from "@/components/product/product-media";
import { Badge } from "@/components/ui/badge";
import { useAdminCatalog } from "@/features/admin/catalog-store";
import { conditionLabel, getProductBySlug } from "@/features/catalog/queries";
import { formatInr, discountPercent } from "@/utils/currency";

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

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 lg:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-border">
        <ProductMedia accent={product.accent} name={product.name} className="aspect-[4/3] min-h-64" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.brand} · {product.sku}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{product.name}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge
            className={
              product.condition === "REFURBISHED" ? "bg-amber-600 text-white" : "bg-emerald-700 text-white"
            }
          >
            {product.condition === "REFURBISHED" ? "REFURBISHED" : "NEW"}
          </Badge>
          <Badge variant="outline">{conditionLabel(product)}</Badge>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
        <div className="mt-6 flex flex-wrap items-baseline gap-3">
          <p className="text-3xl font-semibold">{formatInr(product.salePrice, { compact: true })}</p>
          {discount > 0 ? (
            <>
              <p className="text-sm text-muted-foreground line-through">
                {formatInr(product.price, { compact: true })}
              </p>
              <p className="text-sm font-medium text-emerald-700">{discount}% off</p>
            </>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Warranty: {product.warranty}</p>
        <p className="mt-1 text-sm font-medium">{product.inStock ? "In stock" : "Out of stock"}</p>
        <p className="mt-4 text-sm text-muted-foreground">EMI options will be shown after payment is enabled.</p>
        <div className="mt-6">
          <ProductBuyBox product={product} />
        </div>
        <div className="mt-8">
          <h2 className="text-sm font-semibold">Specifications</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {product.specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
        </div>
        {product.condition === "REFURBISHED" ? (
          <div className="mt-8 rounded-xl border border-border p-4">
            <h2 className="text-sm font-semibold">Refurbishment & condition details</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {conditionLabel(product)}. Warranty on this listing is {product.warranty}. Cosmetic notes and a
              full test checklist will appear from inventory records once those fields are stored for this serial.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
