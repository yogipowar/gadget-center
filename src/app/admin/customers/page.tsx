import type { Metadata } from "next";

import { CustomersScreen } from "@/components/admin/screens/customers-screen";

export const metadata: Metadata = { title: "Customers" };

export default function AdminCustomersPage() {
  return <CustomersScreen />;
}
