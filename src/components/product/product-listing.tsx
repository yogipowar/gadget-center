"use client";

import { SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { PaginationBar } from "@/components/pagination-bar";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ProductCondition } from "@/constants/products";
import { useAdminCatalog } from "@/features/admin/catalog-store";
import { categoryHref, queryCatalog } from "@/features/catalog/queries";
import type { CatalogQuery } from "@/features/catalog/types";
import { paginate } from "@/utils/pagination";

const FILTER_KEYS = ["brand", "condition", "minPrice", "maxPrice", "sort"] as const;
const PAGE_SIZE = 12;
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
] as const;

type ProductListingProps = {
  title: string;
  description?: string;
  filters?: CatalogQuery;
};

function parseNumber(value: string | null) {
  if (value === null || value === "") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseConditions(values: string[]): ProductCondition[] {
  return values.filter((value): value is ProductCondition =>
    value === "NEW" || value === "REFURBISHED" || value === "USED",
  );
}

export function ProductListing(props: ProductListingProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{props.title}</h1>
          {props.description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{props.description}</p>
          ) : null}
        </div>
      }
    >
      <ProductListingInner {...props} />
    </Suspense>
  );
}

function ProductListingInner({ title, description, filters }: ProductListingProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const catalog = useAdminCatalog();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedBrands = params.getAll("brand").flatMap((value) => value.split(",")).filter(Boolean);
  const selectedConditions = parseConditions(
    params.getAll("condition").flatMap((value) => value.split(",")),
  );
  const minPrice = parseNumber(params.get("minPrice")) ?? filters?.minPrice;
  const maxPrice = parseNumber(params.get("maxPrice")) ?? filters?.maxPrice;
  const sort = params.get("sort") ?? "featured";
  const searchQuery = params.get("q")?.trim() || filters?.q;
  const categorySlug = filters?.categorySlug ?? params.get("category") ?? undefined;
  const requestedPage = Math.max(1, Number(params.get("page") || "1") || 1);

  const unfiltered = useMemo(
    () =>
      queryCatalog(
        {
          categorySlug,
          q: searchQuery,
          productType: filters?.productType,
          featured: filters?.featured,
          bestseller: filters?.bestseller,
          newArrival: filters?.newArrival,
          refurbished: filters?.refurbished,
        },
        catalog.products,
      ),
    [catalog.products, categorySlug, filters, searchQuery],
  );

  const products = useMemo(() => {
    const matched = queryCatalog(
      {
        categorySlug,
        q: searchQuery,
        brands: selectedBrands.length ? selectedBrands : filters?.brand ? [filters.brand] : undefined,
        conditions: selectedConditions.length ? selectedConditions : undefined,
        minPrice,
        maxPrice,
        productType: filters?.productType,
        featured: filters?.featured,
        bestseller: filters?.bestseller,
        newArrival: filters?.newArrival,
        refurbished: filters?.refurbished,
      },
      catalog.products,
    );

    const sorted = [...matched];
    if (sort === "price-asc") {
      sorted.sort((left, right) => left.salePrice - right.salePrice);
    } else if (sort === "price-desc") {
      sorted.sort((left, right) => right.salePrice - left.salePrice);
    } else if (sort === "newest") {
      sorted.sort((left, right) => Number(right.newArrival) - Number(left.newArrival));
    }
    return sorted;
  }, [
    catalog.products,
    categorySlug,
    filters,
    maxPrice,
    minPrice,
    searchQuery,
    selectedBrands,
    selectedConditions,
    sort,
  ]);

  const pageSlice = paginate(products, requestedPage, PAGE_SIZE);
  const category = catalog.categories.find((item) => item.slug === categorySlug);
  const heading =
    selectedBrands.length === 1 && !filters?.brand ? `${selectedBrands[0]} products` : title;

  function replaceParams(
    update: (next: URLSearchParams) => void,
    options?: { resetPage?: boolean; scroll?: boolean },
  ) {
    const next = new URLSearchParams(params.toString());
    update(next);
    if (options?.resetPage !== false) {
      next.delete("page");
    }
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: options?.scroll ?? false });
  }

  function goToPage(page: number) {
    replaceParams(
      (next) => {
        if (page <= 1) {
          next.delete("page");
        } else {
          next.set("page", String(page));
        }
      },
      { resetPage: false, scroll: true },
    );
  }

  function toggleValue(key: "brand" | "condition", value: string) {
    replaceParams((next) => {
      const current = next.getAll(key).flatMap((item) => item.split(",")).filter(Boolean);
      next.delete(key);
      const selected = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      for (const item of selected) {
        next.append(key, item);
      }
    });
  }

  function selectPrice(nextMin?: number, nextMax?: number) {
    replaceParams((next) => {
      if (nextMin === undefined) {
        next.delete("minPrice");
      } else {
        next.set("minPrice", String(nextMin));
      }
      if (nextMax === undefined) {
        next.delete("maxPrice");
      } else {
        next.set("maxPrice", String(nextMax));
      }
    });
  }

  function clearFilters() {
    replaceParams((next) => {
      for (const key of FILTER_KEYS) {
        next.delete(key);
      }
    });
  }

  const filterProps = {
    products: unfiltered,
    categories: catalog.categories
      .filter((item) => item.live)
      .map((item) => ({
        slug: item.slug,
        name: item.name,
        href: categoryHref(item.slug),
      })),
    selectedBrands,
    selectedConditions,
    minPrice,
    maxPrice,
    lockedCategory: categorySlug,
    onToggleBrand: (brand: string) => toggleValue("brand", brand),
    onToggleCondition: (condition: ProductCondition) => toggleValue("condition", condition),
    onSelectPrice: selectPrice,
    onClear: clearFilters,
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {category?.name ?? "Catalog"}
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{heading}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
          ) : null}
          <p className="mt-2 text-sm text-muted-foreground">
            {pageSlice.total === 0
              ? "No results"
              : `Showing ${pageSlice.from}–${pageSlice.to} of ${pageSlice.total} ${pageSlice.total === 1 ? "result" : "results"}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <SlidersHorizontal />
            Filters
          </Button>
          <label className="hidden items-center gap-2 text-sm sm:flex">
            <span className="text-muted-foreground">Sort by</span>
            <select
              className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
              value={sort}
              onChange={(event) =>
                replaceParams((next) => {
                  if (event.target.value === "featured") {
                    next.delete("sort");
                  } else {
                    next.set("sort", event.target.value);
                  }
                })
              }
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <ProductFilters {...filterProps} />
        </aside>
        <div>
          <label className="mb-4 flex items-center gap-2 text-sm sm:hidden">
            <span className="text-muted-foreground">Sort by</span>
            <select
              className="h-8 flex-1 rounded-lg border border-input bg-background px-2 text-sm"
              value={sort}
              onChange={(event) =>
                replaceParams((next) => {
                  if (event.target.value === "featured") {
                    next.delete("sort");
                  } else {
                    next.set("sort", event.target.value);
                  }
                })
              }
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <ProductGrid products={pageSlice.items} columns="listing" />
          <PaginationBar className="mt-6" meta={pageSlice} onPageChange={goToPage} showSummary={false} />
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[min(100%,20rem)] overflow-y-auto p-4">
          <SheetHeader className="p-0">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <ProductFilters {...filterProps} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
