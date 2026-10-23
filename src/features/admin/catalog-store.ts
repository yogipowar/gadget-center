"use client";

import { useSyncExternalStore } from "react";

import { LOCAL_STORAGE_KEYS } from "@/constants/storage";
import {
  adminBanners,
  adminBrands,
  adminCategories,
  adminCoupons,
  adminInventory,
  adminRefurbishedUnits,
} from "@/features/admin/fixtures";
import type {
  AdminBanner,
  AdminBrand,
  AdminCategory,
  AdminCoupon,
  AdminInventoryRow,
  AdminRefurbishedUnit,
} from "@/features/admin/types";
import { catalogProducts } from "@/features/catalog/products";
import type { CatalogProduct } from "@/features/catalog/types";

const STORE_VERSION = 7;

export type AdminCatalogState = {
  version: number;
  categories: AdminCategory[];
  brands: AdminBrand[];
  products: CatalogProduct[];
  coupons: AdminCoupon[];
  banners: AdminBanner[];
  inventory: AdminInventoryRow[];
  refurbished: AdminRefurbishedUnit[];
};

function seedState(): AdminCatalogState {
  return {
    version: STORE_VERSION,
    categories: adminCategories.map(({ id, name, slug, live }) => ({
      id,
      name,
      slug,
      description: "",
      live,
    })),
    brands: adminBrands.map(({ id, name, live }) => ({ id, name, live })),
    products: catalogProducts.map((product) => ({ ...product })),
    coupons: adminCoupons.map((item) => ({ ...item })),
    banners: adminBanners.map((item) => ({ ...item })),
    inventory: adminInventory.map((item) => ({ ...item })),
    refurbished: adminRefurbishedUnits.map((item) => ({ ...item })),
  };
}

const SEED = seedState();
const listeners = new Set<() => void>();
let memory: AdminCatalogState = SEED;
let hydrated = false;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function parseState(raw: string | null): AdminCatalogState | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as AdminCatalogState;
    if (parsed.version !== STORE_VERSION || !Array.isArray(parsed.products)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function applySeedImages(state: AdminCatalogState): AdminCatalogState {
  const seedImages = new Map(catalogProducts.map((product) => [product.id, product.image]));
  let changed = false;
  const products = state.products.map((product) => {
    const image = product.image ?? seedImages.get(product.id);
    if (image && image !== product.image) {
      changed = true;
      return { ...product, image };
    }
    return product;
  });
  return changed ? { ...state, products } : state;
}

function hydrate() {
  if (hydrated || typeof window === "undefined") {
    return;
  }
  hydrated = true;
  const loaded = parseState(window.localStorage.getItem(LOCAL_STORAGE_KEYS.adminCatalog)) ?? seedState();
  memory = applySeedImages(loaded);
  if (memory !== loaded) {
    window.localStorage.setItem(LOCAL_STORAGE_KEYS.adminCatalog, JSON.stringify(memory));
  }
}

function persist(next: AdminCatalogState) {
  memory = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_STORAGE_KEYS.adminCatalog, JSON.stringify(next));
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  hydrate();
  return memory;
}

function getServerSnapshot() {
  return SEED;
}

function upsert<T extends { id: string }>(list: T[], item: T) {
  const index = list.findIndex((row) => row.id === item.id);
  if (index === -1) {
    return [item, ...list];
  }
  return list.map((row) => (row.id === item.id ? item : row));
}

export function useAdminCatalog() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function saveCategory(input: Omit<AdminCategory, "id"> & { id?: string }) {
  hydrate();
  const item: AdminCategory = {
    ...input,
    id: input.id || input.slug || newId("cat"),
  };
  persist({ ...memory, categories: upsert(memory.categories, item) });
  return item;
}

export function deleteCategory(id: string) {
  hydrate();
  persist({ ...memory, categories: memory.categories.filter((item) => item.id !== id) });
}

export function saveBrand(input: Omit<AdminBrand, "id"> & { id?: string }) {
  hydrate();
  const item: AdminBrand = {
    ...input,
    id: input.id || input.name.trim().toLowerCase().replace(/\s+/g, "-") || newId("brand"),
  };
  persist({ ...memory, brands: upsert(memory.brands, item) });
  return item;
}

export function deleteBrand(id: string) {
  hydrate();
  persist({ ...memory, brands: memory.brands.filter((item) => item.id !== id) });
}

export function saveProduct(input: CatalogProduct & { onHand?: number }) {
  hydrate();
  const product: CatalogProduct = {
    ...input,
    inStock: (input.onHand ?? (input.inStock ? 1 : 0)) > 0,
  };
  const onHand = input.onHand ?? (product.inStock ? 6 : 0);
  const inventoryRow: AdminInventoryRow = {
    id: product.id,
    sku: product.sku,
    name: product.name,
    onHand,
    reserved: memory.inventory.find((row) => row.id === product.id)?.reserved ?? 0,
    reorderAt: memory.inventory.find((row) => row.id === product.id)?.reorderAt ?? 2,
  };
  persist({
    ...memory,
    products: upsert(memory.products, product),
    inventory: upsert(memory.inventory, inventoryRow),
  });
  return product;
}

export function deleteProduct(id: string) {
  hydrate();
  persist({
    ...memory,
    products: memory.products.filter((item) => item.id !== id),
    inventory: memory.inventory.filter((item) => item.id !== id),
  });
}

export function deleteProducts(ids: string[]) {
  hydrate();
  const remove = new Set(ids);
  persist({
    ...memory,
    products: memory.products.filter((item) => !remove.has(item.id)),
    inventory: memory.inventory.filter((item) => !remove.has(item.id)),
  });
}

export function saveCoupon(input: Omit<AdminCoupon, "id" | "uses"> & { id?: string; uses?: number }) {
  hydrate();
  const item: AdminCoupon = {
    uses: input.uses ?? 0,
    ...input,
    id: input.id || newId("coupon"),
  };
  persist({ ...memory, coupons: upsert(memory.coupons, item) });
  return item;
}

export function deleteCoupon(id: string) {
  hydrate();
  persist({ ...memory, coupons: memory.coupons.filter((item) => item.id !== id) });
}

export function saveBanner(input: Omit<AdminBanner, "id"> & { id?: string }) {
  hydrate();
  const item: AdminBanner = {
    ...input,
    id: input.id || newId("banner"),
  };
  persist({ ...memory, banners: upsert(memory.banners, item) });
  return item;
}

export function deleteBanner(id: string) {
  hydrate();
  persist({ ...memory, banners: memory.banners.filter((item) => item.id !== id) });
}

export function saveInventory(row: AdminInventoryRow) {
  hydrate();
  persist({
    ...memory,
    inventory: upsert(memory.inventory, row),
    products: memory.products.map((product) =>
      product.id === row.id ? { ...product, inStock: row.onHand > 0 } : product,
    ),
  });
}

export function saveRefurbished(input: Omit<AdminRefurbishedUnit, "id"> & { id?: string }) {
  hydrate();
  const item: AdminRefurbishedUnit = {
    ...input,
    id: input.id || newId("unit"),
  };
  persist({ ...memory, refurbished: upsert(memory.refurbished, item) });
  return item;
}

export function deleteRefurbished(id: string) {
  hydrate();
  persist({ ...memory, refurbished: memory.refurbished.filter((item) => item.id !== id) });
}

export function createRecordId(prefix: string) {
  return newId(prefix);
}
