"use client";

import { apiClient } from "@/lib/api/client";
import { routes } from "@/config/routes";
import type { CustomerSession } from "@/features/account/types";
import type { AdminOrder } from "@/features/admin/types";

export type CustomerAccount = {
  session: CustomerSession;
  orders: AdminOrder[];
};

export async function loadCustomerAccount(): Promise<CustomerAccount | null> {
  const response = await apiClient.get<{ session: CustomerSession; orders: AdminOrder[] }>(
    routes.api.accountOrders,
  );
  if (!response.success || !response.data) {
    return null;
  }
  return response.data;
}

export async function loginCustomer(mobile: string, orderNumber: string): Promise<CustomerAccount> {
  const response = await apiClient.post<CustomerAccount>(routes.api.accountLogin, {
    mobile,
    orderNumber,
  });
  if (!response.success || !response.data) {
    throw new Error(response.message || "Could not sign in.");
  }
  return response.data;
}

export async function logoutCustomer() {
  await apiClient.post(routes.api.accountLogout);
}
