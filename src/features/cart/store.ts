"use client";

import { useSyncExternalStore } from "react";

import { apiClient } from "@/lib/api/client";
import { routes } from "@/config/routes";
import type { CartState } from "@/features/cart/types";

export type { CartLine, CartState } from "@/features/cart/types";

const EMPTY_CART: CartState = { items: [] };
const listeners = new Set<() => void>();

let memoryCart: CartState = EMPTY_CART;
let hydrated = false;
let inflight: Promise<void> | null = null;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

async function hydrateFromApi() {
  if (hydrated) {
    return;
  }
  const response = await apiClient.get<CartState>(routes.api.cart);
  memoryCart = response.success && response.data ? response.data : EMPTY_CART;
  hydrated = true;
  emit();
}

function ensureHydrated() {
  if (!inflight) {
    inflight = hydrateFromApi().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

async function persistCart(next: CartState) {
  memoryCart = next.items.length === 0 ? EMPTY_CART : next;
  emit();
  const response = await apiClient.put<CartState>(routes.api.cart, memoryCart);
  if (response.success && response.data) {
    memoryCart = response.data;
    emit();
  }
}

function getSnapshot() {
  void ensureHydrated();
  return memoryCart;
}

function getServerSnapshot() {
  return EMPTY_CART;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  void ensureHydrated();
  return () => listeners.delete(listener);
}

export function addToCart(slug: string, quantity = 1) {
  const existing = memoryCart.items.find((item) => item.slug === slug);
  const items = existing
    ? memoryCart.items.map((item) =>
        item.slug === slug
          ? { ...item, quantity: Math.min(item.quantity + quantity, 10) }
          : item,
      )
    : [...memoryCart.items, { slug, quantity }];
  void persistCart({ items });
}

export function updateCartQuantity(slug: string, quantity: number) {
  const items =
    quantity <= 0
      ? memoryCart.items.filter((item) => item.slug !== slug)
      : memoryCart.items.map((item) =>
          item.slug === slug ? { ...item, quantity: Math.min(quantity, 10) } : item,
        );
  void persistCart({ items });
}

export function removeFromCart(slug: string) {
  void persistCart({ items: memoryCart.items.filter((item) => item.slug !== slug) });
}

export function clearCart() {
  void persistCart(EMPTY_CART);
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function cartCount(state: CartState) {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}
