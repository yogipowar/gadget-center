import type { Metadata } from "next";

import { RefurbishedScreen } from "@/components/admin/screens/refurbished-screen";

export const metadata: Metadata = { title: "Refurbished units" };

export default function AdminRefurbishedPage() {
  return <RefurbishedScreen />;
}
