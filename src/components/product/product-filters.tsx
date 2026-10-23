"use client";

import Link from "next/link";

import { budgetBands, laptopBrands, shopCategories } from "@/features/catalog/queries";
import type { CatalogProduct } from "@/features/catalog/types";
import type { ProductCondition } from "@/constants/products";
import { cn } from "@/lib/utils";

type ProductFiltersProps = {
  products: CatalogProduct[];
  selectedBrands: string[];
  selectedConditions: ProductCondition[];
  minPrice?: number;
  maxPrice?: number;
  lockedCategory?: string;
  onToggleBrand: (brand: string) => void;
  onToggleCondition: (condition: ProductCondition) => void;
  onSelectPrice: (min?: number, max?: number) => void;
  onClear: () => void;
};

export function ProductFilters({
  products,
  selectedBrands,
  selectedConditions,
  minPrice,
  maxPrice,
  lockedCategory,
  onToggleBrand,
  onToggleCondition,
  onSelectPrice,
  onClear,
}: ProductFiltersProps) {
  const availableBrands = laptopBrands.filter((brand) =>
    products.some((product) => product.brand.toLowerCase() === brand.toLowerCase()),
  );
  const hasNew = products.some((product) => product.condition === "NEW");
  const hasRefurbished = products.some((product) => product.condition === "REFURBISHED");
  const hasActive =
    selectedBrands.length > 0 ||
    selectedConditions.length > 0 ||
    minPrice !== undefined ||
    maxPrice !== undefined;

  return (
    <div className="space-y-6 text-sm">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Filters</p>
        {hasActive ? (
          <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={onClear}>
            Clear all
          </button>
        ) : null}
      </div>

      <section>
        <h3 className="mb-2 font-semibold">Category</h3>
        <ul className="space-y-1.5">
          <li>
            <Link
              href="/products"
              className={cn(
                "block hover:text-primary",
                !lockedCategory ? "font-medium text-primary" : "text-muted-foreground",
              )}
            >
              All products
            </Link>
          </li>
          {shopCategories.map((category) => (
            <li key={category.slug}>
              <Link
                href={category.href}
                className={cn(
                  "block hover:text-primary",
                  lockedCategory === category.slug ? "font-medium text-primary" : "text-muted-foreground",
                )}
              >
                {category.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {hasNew || hasRefurbished ? (
        <section>
          <h3 className="mb-2 font-semibold">Condition</h3>
          <div className="space-y-2">
            {hasNew ? (
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="size-3.5 accent-primary"
                  checked={selectedConditions.includes("NEW")}
                  onChange={() => onToggleCondition("NEW")}
                />
                New
              </label>
            ) : null}
            {hasRefurbished ? (
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="size-3.5 accent-primary"
                  checked={selectedConditions.includes("REFURBISHED")}
                  onChange={() => onToggleCondition("REFURBISHED")}
                />
                Refurbished
              </label>
            ) : null}
          </div>
        </section>
      ) : null}

      {availableBrands.length > 0 ? (
        <section>
          <h3 className="mb-2 font-semibold">Brand</h3>
          <div className="space-y-2">
            {availableBrands.map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="size-3.5 accent-primary"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onToggleBrand(brand)}
                />
                {brand}
              </label>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h3 className="mb-2 font-semibold">Price</h3>
        <div className="space-y-2">
          {budgetBands.map((band) => {
            const active = minPrice === band.minPrice && maxPrice === band.maxPrice;
            return (
              <label key={band.label} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="size-3.5 accent-primary"
                  checked={active}
                  onChange={() =>
                    onSelectPrice(active ? undefined : band.minPrice, active ? undefined : band.maxPrice)
                  }
                />
                {band.label}
              </label>
            );
          })}
        </div>
      </section>
    </div>
  );
}
