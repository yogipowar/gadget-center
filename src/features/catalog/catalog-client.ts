"use client";

import { apiClient } from "@/lib/api/client";
import { routes } from "@/config/routes";
import type { CatalogProduct } from "@/features/catalog/types";

const listeners = new Set<() => void>();
let products: CatalogProduct[] = [];
let loaded = false;
let inflight: Promise<void> | null = null;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export async function refreshCatalog() {
  const response = await apiClient.get<CatalogProduct[]>(routes.api.products);
  products = response.success && response.data ? response.data : [];
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

export function catalogLoaded() {
  return loaded;
}

const EMPTY_PRODUCTS: CatalogProduct[] = [];

export function getServerCatalogProducts(): CatalogProduct[] {
  return EMPTY_PRODUCTS;
}
