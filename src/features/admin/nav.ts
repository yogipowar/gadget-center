import { LayoutDashboard, Package, ShoppingCart, type LucideIcon } from "lucide-react";

import { routes } from "@/config/routes";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export const adminNav: AdminNavGroup[] = [
  {
    title: "Admin",
    items: [
      { href: routes.admin.dashboard, label: "Dashboard", icon: LayoutDashboard },
      { href: routes.admin.products, label: "Products", icon: Package },
      { href: routes.admin.orders, label: "Orders", icon: ShoppingCart },
    ],
  },
];
