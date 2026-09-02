import type { Metadata } from "next";

import { CouponsScreen } from "@/components/admin/screens/coupons-screen";

export const metadata: Metadata = { title: "Coupons" };

export default function AdminCouponsPage() {
  return <CouponsScreen />;
}
