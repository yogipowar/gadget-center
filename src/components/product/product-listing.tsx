"use client";

import { ProductGrid } from "@/components/product/product-grid";
import { useAdminCatalog } from "@/features/admin/catalog-store";
import { queryCatalog } from "@/features/catalog/queries";
import type { CatalogQuery } from "@/features/catalog/types";

type ProductListingProps = {
  title: string;
  description?: string;
  filters?: CatalogQuery;
};

export function ProductListing({ title, description, filters }: ProductListingProps) {
  const catalog = useAdminCatalog();
  const products = queryCatalog(filters, catalog.products);
  const category = catalog.categories.find((item) => item.slug === filters?.categorySlug);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {category?.name ?? "Catalog"}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
