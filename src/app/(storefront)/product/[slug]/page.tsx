import type { Metadata } from "next";

import { ProductDetailClient } from "@/app/(storefront)/product/[slug]/product-detail-client";
import { catalogProducts, getProductBySlug } from "@/features/catalog/queries";
import { loadCatalog } from "@/lib/catalog-server";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return catalogProducts.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const products = await loadCatalog();
  const product = getProductBySlug(slug, products);
  if (!product) {
    return { title: "Product" };
  }
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const products = await loadCatalog();
  const product = getProductBySlug(slug, products);
  return <ProductDetailClient slug={slug} initialProduct={product ?? undefined} />;
}
