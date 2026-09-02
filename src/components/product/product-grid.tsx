import { ProductCard } from "@/components/product/product-card";
import type { CatalogProduct } from "@/features/catalog/types";

type ProductGridProps = {
  products: CatalogProduct[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
        No products match this selection yet. Try another category or talk to our team.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
