import "server-only";

import { catalogProducts } from "@/features/catalog/products";
import type { CatalogProduct } from "@/features/catalog/types";
import { logger } from "@/lib/logger";
import { listProducts } from "@/services/product-service";

export async function loadCatalog(): Promise<CatalogProduct[]> {
  try {
    return await listProducts();
  } catch (error) {
    logger.error("Catalog database unavailable", error);
    return catalogProducts;
  }
}
