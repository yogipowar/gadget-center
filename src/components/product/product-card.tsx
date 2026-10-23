import Link from "next/link";

import { ProductMedia } from "@/components/product/product-media";
import { routes } from "@/config/routes";
import { productFacts } from "@/features/catalog/queries";
import type { CatalogProduct } from "@/features/catalog/types";
import { discountPercent, formatInr } from "@/utils/currency";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: CatalogProduct;
};

function shortProcessor(value: string) {
  const ultra = value.match(/ultra\s*(\d)/i);
  if (ultra) {
    return `Ultra ${ultra[1]}`;
  }
  const core = value.match(/i[3579]/i);
  const gen = value.match(/(\d+)(?:th|st|nd|rd)\s*gen/i);
  if (core && gen) {
    return `${core[0]} ${gen[1]}th`;
  }
  if (core) {
    return core[0];
  }
  return value.replace(/intel\s+/i, "").split(",")[0]?.trim() ?? value;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = discountPercent(product.price, product.salePrice);
  const facts = productFacts(product);
  const isRefurbished = product.condition === "REFURBISHED";
  const specLine = [shortProcessor(facts.processor), facts.ram, facts.storageCapacity]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="h-full">
      <Link
        href={routes.product(product.slug)}
        className="group flex h-full flex-col rounded-2xl bg-white p-2 transition-colors duration-200 hover:bg-zinc-50/80"
      >
        <div className="relative overflow-hidden rounded-xl bg-zinc-50">
          <ProductMedia
            compact
            accent={product.accent}
            name={product.name}
            image={product.image}
            className="transition-transform duration-300 group-hover:scale-[1.06]"
          />
          <span
            className={cn(
              "absolute top-2 left-2 inline-flex h-5 items-center rounded-md px-1.5 text-[10px] font-semibold tracking-wide text-white",
              isRefurbished ? "bg-brand-green" : "bg-brand-blue",
            )}
          >
            {isRefurbished ? "Refurbished" : "New"}
          </span>
          {discount > 0 ? (
            <span className="absolute top-2 right-2 inline-flex h-5 items-center rounded-md bg-brand-blue px-1.5 text-[10px] font-semibold text-white">
              {discount}% off
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col px-1 pt-2.5 pb-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">
            {product.brand}
          </p>
          <h3 className="mt-0.5 line-clamp-2 text-sm leading-5 font-medium text-zinc-900 group-hover:text-brand-blue">
            {product.name}
          </h3>
          {specLine ? (
            <p className="mt-1 truncate text-[11px] text-zinc-500">{specLine}</p>
          ) : null}

          <div className="mt-auto pt-2">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <p className="text-[15px] font-semibold tracking-tight text-zinc-950">
                {formatInr(product.salePrice, { compact: true })}
              </p>
              {discount > 0 ? (
                <p className="text-xs text-zinc-400 line-through">
                  {formatInr(product.price, { compact: true })}
                </p>
              ) : null}
            </div>
            <p className="mt-0.5 text-[11px] text-zinc-500">Free shipping</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
