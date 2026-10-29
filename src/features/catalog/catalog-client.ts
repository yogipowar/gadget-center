"use client";

import { apiClient } from "@/lib/api/client";
import { routes } from "@/config/routes";
import { builtinAdminCategories } from "@/features/catalog/queries";
import type { CatalogProduct } from "@/features/catalog/types";
import type { AdminCategory } from "@/features/admin/types";

const listeners = new Set<() => void>();
let products: CatalogProduct[] = [];
let categories: AdminCategory[] = builtinAdminCategories();
let loaded = false;
let inflight: Promise<void> | null = null;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export async function refreshCatalog() {
  const [productResponse, categoryResponse] = await Promise.all([
    apiClient.get<CatalogProduct[]>(routes.api.products),
    apiClient.get<AdminCategory[]>(routes.api.categories),
  ]);
  products = productResponse.success && productResponse.data ? productResponse.data : [];
  categories =
    categoryResponse.success && categoryResponse.data
      ? categoryResponse.data
      : builtinAdminCategories();
  loaded = true;
  emit();
}

function ensureLoad() {
  if (!inflight) {
    inflight = refreshCatalog().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

export function subscribeCatalog(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  void ensureLoad();
  return () => listeners.delete(onStoreChange);
}

export function readCatalogProducts() {
  return products;
}

export function readCatalogCategories() {
  return categories;
}

export function catalogLoaded() {
  return loaded;
}

const EMPTY_PRODUCTS: CatalogProduct[] = [];
const SERVER_CATEGORIES = builtinAdminCategories();

export function getServerCatalogProducts(): CatalogProduct[] {
  return EMPTY_PRODUCTS;
}

export function getServerCatalogCategories(): AdminCategory[] {
  return SERVER_CATEGORIES;
}
