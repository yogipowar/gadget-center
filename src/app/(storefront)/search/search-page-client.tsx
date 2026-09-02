"use client";

import { useSearchParams } from "next/navigation";

import { ProductListing } from "@/components/product/product-listing";

export function SearchPageClient() {
  const query = useSearchParams().get("q")?.trim() ?? "";

  return (
    <ProductListing
      title={query ? `Results for “${query}”` : "Search"}
      description="Search by product name, brand, SKU or specification."
      filters={{ q: query || undefined }}
    />
  );
}
