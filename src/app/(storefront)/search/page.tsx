import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchPageClient } from "@/app/(storefront)/search/search-page-client";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}
