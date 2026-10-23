"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes";

export function AdminUnusedRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(routes.admin.dashboard);
  }, [router]);

  return (
    <p className="text-sm text-muted-foreground">Taking you to the dashboard…</p>
  );
}
