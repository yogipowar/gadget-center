"use client";

import { useCallback, useEffect, useState } from "react";

import { apiClient } from "@/lib/api/client";
import { routes } from "@/config/routes";
import type { AdminOrder } from "@/features/admin/types";

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const response = await apiClient.get<AdminOrder[]>(routes.api.adminOrders);
    if (response.success && response.data) {
      setOrders(response.data);
      setError(null);
    } else {
      setError(response.message || "Could not load orders.");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => {
      void refresh();
    }, 12_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  async function markPaid(id: string) {
    const response = await apiClient.patch<AdminOrder>(routes.api.adminOrders, { id });
    if (!response.success || !response.data) {
      throw new Error(response.message || "Could not mark the order as paid.");
    }
    setOrders((current) => current.map((order) => (order.id === id ? response.data! : order)));
    return response.data;
  }

  return { orders, loaded, error, markPaid };
}
