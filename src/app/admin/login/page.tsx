import type { Metadata } from "next";

import { LoginScreen } from "@/components/admin/screens/login-screen";

export const metadata: Metadata = { title: "Staff sign in" };

export default function AdminLoginPage() {
  return <LoginScreen />;
}
