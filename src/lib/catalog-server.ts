import "server-only";

import { catalogProducts } from "@/features/catalog/products";
import { builtinAdminCategories } from "@/features/catalog/queries";
import type { CatalogProduct } from "@/features/catalog/types";
import type { AdminCategory } from "@/features/admin/types";
import { logger } from "@/lib/logger";
import { listCategories } from "@/services/category-service";
import { listProducts } from "@/services/product-service";

export async function loadCatalog(): Promise<CatalogProduct[]> {
  try {
    return await listProducts();
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown error";
    logger.warn(`Catalog database unavailable, using local catalogue (${detail})`);
    return catalogProducts;
  }
}

export async function loadCategories(): Promise<AdminCategory[]> {
  try {
    return await listCategories();
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown error";
    logger.warn(`Category database unavailable, using built-in menus (${detail})`);
    return builtinAdminCategories();
  }
}
