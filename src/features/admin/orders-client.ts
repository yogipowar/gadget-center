"use client";

import { useEffect, useState } from "react";

import { apiClient } from "@/lib/api/client";
import { routes } from "@/config/routes";
import type { AdminOrder } from "@/features/admin/types";

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiClient.get<AdminOrder[]>(routes.api.adminOrders).then((response) => {
      if (cancelled) {
        return;
      }
      setOrders(response.success && response.data ? response.data : []);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { orders, loaded };
}
