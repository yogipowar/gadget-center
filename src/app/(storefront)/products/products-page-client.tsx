"use client";

import { useSearchParams } from "next/navigation";

import { ProductListing } from "@/components/product/product-listing";

export function ProductsPageClient() {
  const params = useSearchParams();
  const brand = params.get("brand") ?? undefined;
  const category = params.get("category") ?? undefined;
  const q = params.get("q")?.trim() || undefined;
  const minPriceValue = params.get("minPrice");
  const maxPriceValue = params.get("maxPrice");
  const minPrice = minPriceValue ? Number(minPriceValue) : undefined;
  const maxPrice = maxPriceValue ? Number(maxPriceValue) : undefined;

  const title = brand ? `${brand} products` : category ? category.replace(/-/g, " ") : "All products";

  return (
    <ProductListing
      title={title}
      description={
        brand
          ? `Showing ${brand} laptops, desktops and accessories.`
          : category
            ? "Products in this category, including items added from the admin panel."
            : "New laptops, refurbished devices, desktops and accessories."
      }
      filters={{
        brand,
        categorySlug: category,
        minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
        maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
        q,
      }}
    />
  );
}
