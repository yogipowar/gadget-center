"use client";

import { useSyncExternalStore } from "react";

import { apiClient } from "@/lib/api/client";
import { routes } from "@/config/routes";
import {
  catalogLoaded,
  getServerCatalogProducts,
  readCatalogProducts,
  refreshCatalog,
  subscribeCatalog,
} from "@/features/catalog/catalog-client";
import { shopCategories } from "@/features/catalog/queries";
import type { CatalogProduct } from "@/features/catalog/types";
import type { AdminBrand, AdminCategory, AdminInventoryRow } from "@/features/admin/types";

export type AdminCatalogState = {
  products: CatalogProduct[];
  categories: AdminCategory[];
  brands: AdminBrand[];
  inventory: AdminInventoryRow[];
  loaded: boolean;
};

function buildState(products: CatalogProduct[], loaded: boolean): AdminCatalogState {
  const brands = [...new Set(products.map((product) => product.brand).filter(Boolean))].map((name) => ({
    id: name.toLowerCase(),
    name,
    live: true,
  }));
  return {
    products,
    loaded,
    categories: shopCategories.map((category) => ({
      id: category.slug,
      name: category.title,
      slug: category.slug,
      description: category.description,
      live: true,
    })),
    brands: brands.length
      ? brands
      : [
          { id: "dell", name: "Dell", live: true },
          { id: "hp", name: "HP", live: true },
        ],
    inventory: products.map((product) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      onHand: product.onHand ?? 0,
      reserved: 0,
      reorderAt: 2,
    })),
  };
}

const SERVER_SNAPSHOT = buildState(getServerCatalogProducts(), false);
let snapshot = SERVER_SNAPSHOT;

function getSnapshot(): AdminCatalogState {
  const products = readCatalogProducts();
  const loaded = catalogLoaded();
  if (snapshot.products === products && snapshot.loaded === loaded) {
    return snapshot;
  }
  snapshot = buildState(products, loaded);
  return snapshot;
}

function getServerSnapshot(): AdminCatalogState {
  return SERVER_SNAPSHOT;
}

export function useAdminCatalog() {
  return useSyncExternalStore(subscribeCatalog, getSnapshot, getServerSnapshot);
}

export function createRecordId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function saveProduct(input: CatalogProduct & { onHand?: number }) {
  const payload: CatalogProduct = {
    ...input,
    inStock: (input.onHand ?? (input.inStock ? 1 : 0)) > 0,
    onHand: input.onHand ?? (input.inStock ? 1 : 0),
  };
  const response = await apiClient.put<CatalogProduct>(routes.api.adminProducts, payload);
  if (!response.success) {
    throw new Error(response.message);
  }
  await refreshCatalog();
  return response.data;
}

export async function deleteProduct(id: string) {
  const response = await apiClient.delete<{ removed: number }>(routes.api.adminProducts, {
    body: { ids: [id] },
  });
  if (!response.success) {
    throw new Error(response.message);
  }
  await refreshCatalog();
}

export async function deleteProducts(ids: string[]) {
  const response = await apiClient.delete<{ removed: number }>(routes.api.adminProducts, {
    body: { ids },
  });
  if (!response.success) {
    throw new Error(response.message);
  }
  await refreshCatalog();
}

function unusedTool(..._args: unknown[]): never {
  throw new Error("This admin tool is not enabled.");
}

export const saveCategory = unusedTool;
export const deleteCategory = unusedTool;
export const saveBrand = unusedTool;
export const deleteBrand = unusedTool;
export const saveCoupon = unusedTool;
export const deleteCoupon = unusedTool;
export const saveBanner = unusedTool;
export const deleteBanner = unusedTool;
export const saveInventory = unusedTool;
export const saveRefurbished = unusedTool;
export const deleteRefurbished = unusedTool;
