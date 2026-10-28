"use client";

import { useCallback, useEffect, useState } from "react";

import { apiClient } from "@/lib/api/client";
import { routes } from "@/config/routes";
import type { AdminOrder } from "@/features/admin/types";

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const response = await apiClient.get<AdminOrder[]>(routes.api.adminOrders);
    setOrders(response.success && response.data ? response.data : []);
    setLoaded(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function markPaid(id: string) {
    const response = await apiClient.patch<AdminOrder>(routes.api.adminOrders, { id });
    if (!response.success || !response.data) {
      throw new Error(response.message || "Could not mark the order as paid.");
    }
    setOrders((current) => current.map((order) => (order.id === id ? response.data! : order)));
    return response.data;
  }

  return { orders, loaded, markPaid };
}
