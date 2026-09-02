import type { Metadata } from "next";

import { LeadsScreen } from "@/components/admin/screens/leads-screen";

export const metadata: Metadata = { title: "Leads" };

export default function AdminLeadsPage() {
  return <LeadsScreen />;
}
