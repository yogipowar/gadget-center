"use client";

import { useSyncExternalStore } from "react";

import { LOCAL_STORAGE_KEYS } from "@/constants/storage";

export type CartLine = {
  slug: string;
  quantity: number;
};

type CartState = {
  items: CartLine[];
};

const EMPTY_CART: CartState = { items: [] };
const listeners = new Set<() => void>();

let memoryCart: CartState = EMPTY_CART;
let hydrated = false;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function parseCart(raw: string | null): CartState {
  if (!raw) {
    return EMPTY_CART;
  }
  try {
    const parsed = JSON.parse(raw) as CartState;
    if (!Array.isArray(parsed.items) || parsed.items.length === 0) {
      return EMPTY_CART;
    }
    return parsed;
  } catch {
    return EMPTY_CART;
  }
}

function hydrateFromStorage() {
  if (hydrated || typeof window === "undefined") {
    return;
  }
  hydrated = true;
  memoryCart = parseCart(window.localStorage.getItem(LOCAL_STORAGE_KEYS.cart));
}

function writeCart(next: CartState) {
  memoryCart = next.items.length === 0 ? EMPTY_CART : next;
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.cart, JSON.stringify(memoryCart));
  emit();
}

function getSnapshot() {
  hydrateFromStorage();
  return memoryCart;
}

function getServerSnapshot() {
  return EMPTY_CART;
}

function onStorage(event: StorageEvent) {
  if (event.key !== LOCAL_STORAGE_KEYS.cart) {
    return;
  }
  memoryCart = parseCart(event.newValue);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1 && typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function addToCart(slug: string, quantity = 1) {
  hydrateFromStorage();
  const existing = memoryCart.items.find((item) => item.slug === slug);
  const items = existing
    ? memoryCart.items.map((item) =>
        item.slug === slug
          ? { ...item, quantity: Math.min(item.quantity + quantity, 10) }
          : item,
      )
    : [...memoryCart.items, { slug, quantity }];
  writeCart({ items });
}

export function updateCartQuantity(slug: string, quantity: number) {
  hydrateFromStorage();
  const items =
    quantity <= 0
      ? memoryCart.items.filter((item) => item.slug !== slug)
      : memoryCart.items.map((item) =>
          item.slug === slug ? { ...item, quantity: Math.min(quantity, 10) } : item,
        );
  writeCart({ items });
}

export function removeFromCart(slug: string) {
  hydrateFromStorage();
  writeCart({ items: memoryCart.items.filter((item) => item.slug !== slug) });
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function cartCount(state: CartState) {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}
