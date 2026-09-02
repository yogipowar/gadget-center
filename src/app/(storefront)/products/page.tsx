import type { Metadata } from "next";
import { Suspense } from "react";

import { ProductsPageClient } from "@/app/(storefront)/products/products-page-client";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse new and refurbished laptops, desktops and computer accessories.",
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-semibold tracking-tight">All products</h1>
        </div>
      }
    >
      <ProductsPageClient />
    </Suspense>
  );
}
