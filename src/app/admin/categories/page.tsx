import type { Metadata } from "next";

import { CategoriesScreen } from "@/components/admin/screens/categories-screen";

export const metadata: Metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return <CategoriesScreen />;
}
