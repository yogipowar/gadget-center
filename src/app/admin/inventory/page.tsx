import type { Metadata } from "next";

import { InventoryScreen } from "@/components/admin/screens/inventory-screen";

export const metadata: Metadata = { title: "Inventory" };

export default function AdminInventoryPage() {
  return <InventoryScreen />;
}
