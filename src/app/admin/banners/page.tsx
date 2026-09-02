import type { Metadata } from "next";

import { BannersScreen } from "@/components/admin/screens/banners-screen";

export const metadata: Metadata = { title: "Banners" };

export default function AdminBannersPage() {
  return <BannersScreen />;
}
