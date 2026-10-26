import type { CatalogProduct } from "@/features/catalog/types";
import type { Product } from "@/database/models/product";

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function toCatalogProduct(row: Product): CatalogProduct {
  const specs = parseJsonArray(row.specsJson);
  const images = parseJsonArray(row.imagesJson);
  const accent =
    row.accent === "slate" || row.accent === "teal" || row.accent === "stone" || row.accent === "navy"
      ? row.accent
      : "navy";
  return {
    id: row.id,
    sku: row.sku,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    categorySlug: row.categorySlug,
    productType: row.productType as CatalogProduct["productType"],
    condition: row.condition as CatalogProduct["condition"],
    grade: (row.grade as CatalogProduct["grade"]) || undefined,
    price: row.price,
    salePrice: row.salePrice,
    warranty: row.warranty,
    specs,
    shortDescription: row.shortDescription,
    featured: Boolean(row.featured),
    bestseller: Boolean(row.bestseller),
    newArrival: Boolean(row.newArrival),
    inStock: Boolean(row.inStock) && row.onHand > 0,
    onHand: row.onHand,
    accent,
    image: row.image ?? undefined,
    images: images.length ? images : row.image ? [row.image] : [],
  };
}

export function fromCatalogProduct(product: CatalogProduct) {
  const onHand = Math.max(0, product.onHand ?? 0);
  return {
    id: product.id,
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    categorySlug: product.categorySlug,
    productType: product.productType,
    condition: product.condition,
    grade: product.grade ?? null,
    price: product.price,
    salePrice: product.salePrice,
    warranty: product.warranty ?? "",
    specsJson: JSON.stringify(product.specs ?? []),
    shortDescription: product.shortDescription,
    featured: Boolean(product.featured),
    bestseller: Boolean(product.bestseller),
    newArrival: Boolean(product.newArrival),
    inStock: onHand > 0,
    onHand,
    accent: product.accent,
    image: product.image ?? null,
    imagesJson: JSON.stringify(product.images?.length ? product.images : product.image ? [product.image] : []),
  };
}
