import type { Metadata } from "next";

import { ProductsScreen } from "@/components/admin/screens/products-screen";

export const metadata: Metadata = { title: "Products" };

export default function AdminProductsPage() {
  return <ProductsScreen />;
}
