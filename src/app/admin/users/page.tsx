import type { Metadata } from "next";

import { UsersScreen } from "@/components/admin/screens/users-screen";

export const metadata: Metadata = { title: "Staff" };

export default function AdminUsersPage() {
  return <UsersScreen />;
}
