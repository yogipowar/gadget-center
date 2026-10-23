import { ProductCard } from "@/components/product/product-card";
import type { CatalogProduct } from "@/features/catalog/types";
import { cn } from "@/lib/utils";

type ProductGridProps = {
  products: CatalogProduct[];
  columns?: "default" | "listing";
};

export function ProductGrid({ products, columns = "default" }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
        No products match this selection yet. Try another category or talk to our team.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4",
        columns === "listing" ? "lg:grid-cols-3 xl:grid-cols-4" : "sm:grid-cols-3 lg:grid-cols-4",
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
