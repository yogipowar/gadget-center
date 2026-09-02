import type { Metadata } from "next";

import { BrandsScreen } from "@/components/admin/screens/brands-screen";

export const metadata: Metadata = { title: "Brands" };

export default function AdminBrandsPage() {
  return <BrandsScreen />;
}
