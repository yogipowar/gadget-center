"use client";

import { useSyncExternalStore } from "react";

import { apiClient } from "@/lib/api/client";
import { routes } from "@/config/routes";
import {
  catalogLoaded,
  getServerCatalogCategories,
  getServerCatalogProducts,
  readCatalogCategories,
  readCatalogProducts,
  refreshCatalog,
  subscribeCatalog,
} from "@/features/catalog/catalog-client";
import { shopBrands } from "@/features/catalog/queries";
import type { CatalogProduct } from "@/features/catalog/types";
import type { AdminBrand, AdminCategory, AdminInventoryRow } from "@/features/admin/types";

export type AdminCatalogState = {
  products: CatalogProduct[];
  categories: AdminCategory[];
  brands: AdminBrand[];
  inventory: AdminInventoryRow[];
  loaded: boolean;
};

function buildState(
  products: CatalogProduct[],
  categories: AdminCategory[],
  loaded: boolean,
): AdminCatalogState {
  const brandNames = [...new Set([...shopBrands, ...products.map((product) => product.brand).filter(Boolean)])];
  brandNames.sort((a, b) => a.localeCompare(b));
  const brands = brandNames.map((name) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    live: true,
  }));
  return {
    products,
    loaded,
    categories,
    brands,
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

const SERVER_SNAPSHOT = buildState(getServerCatalogProducts(), getServerCatalogCategories(), false);
let snapshot = SERVER_SNAPSHOT;

function getSnapshot(): AdminCatalogState {
  const products = readCatalogProducts();
  const categories = readCatalogCategories();
  const loaded = catalogLoaded();
  if (snapshot.products === products && snapshot.categories === categories && snapshot.loaded === loaded) {
    return snapshot;
  }
  snapshot = buildState(products, categories, loaded);
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

export async function saveCategory(input: Omit<AdminCategory, "id"> & { id?: string }) {
  const response = input.id
    ? await apiClient.put<AdminCategory>(routes.api.adminCategories, input)
    : await apiClient.post<AdminCategory>(routes.api.adminCategories, input);
  if (!response.success) {
    throw new Error(response.message);
  }
  await refreshCatalog();
  return response.data;
}

export async function deleteCategory(id: string) {
  const response = await apiClient.delete<{ removed: number }>(routes.api.adminCategories, {
    body: { id },
  });
  if (!response.success) {
    throw new Error(response.message);
  }
  await refreshCatalog();
}

function unusedTool(..._args: unknown[]): never {
  throw new Error("This admin tool is not enabled.");
}

export const saveBrand = unusedTool;
export const deleteBrand = unusedTool;
export const saveCoupon = unusedTool;
export const deleteCoupon = unusedTool;
export const saveBanner = unusedTool;
export const deleteBanner = unusedTool;
export const saveInventory = unusedTool;
export const saveRefurbished = unusedTool;
export const deleteRefurbished = unusedTool;
