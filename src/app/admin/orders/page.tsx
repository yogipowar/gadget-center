import type { Metadata } from "next";

import { OrdersScreen } from "@/components/admin/screens/orders-screen";

export const metadata: Metadata = { title: "Orders" };

export default function AdminOrdersPage() {
  return <OrdersScreen />;
}
