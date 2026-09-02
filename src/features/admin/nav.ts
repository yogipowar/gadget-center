import {
  BarChart3,
  Bookmark,
  Boxes,
  ClipboardList,
  Image,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  Star,
  Tags,
  Ticket,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

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
    title: "Overview",
    items: [
      { href: routes.admin.dashboard, label: "Dashboard", icon: LayoutDashboard },
      { href: routes.admin.reports, label: "Reports", icon: BarChart3 },
    ],
  },
  {
    title: "Sales",
    items: [
      { href: routes.admin.leads, label: "Leads", icon: ClipboardList },
      { href: routes.admin.enquiries, label: "Enquiries", icon: MessageSquare },
      { href: routes.admin.customers, label: "Customers", icon: Users },
      { href: routes.admin.orders, label: "Orders", icon: ShoppingCart },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: routes.admin.products, label: "Products", icon: Package },
      { href: routes.admin.categories, label: "Categories", icon: Bookmark },
      { href: routes.admin.brands, label: "Brands", icon: Tags },
      { href: routes.admin.coupons, label: "Coupons", icon: Ticket },
      { href: routes.admin.banners, label: "Banners", icon: Image },
      { href: routes.admin.reviews, label: "Reviews", icon: Star },
    ],
  },
  {
    title: "Stock",
    items: [
      { href: routes.admin.inventory, label: "Inventory", icon: Boxes },
      { href: routes.admin.refurbished, label: "Refurbished units", icon: Wrench },
    ],
  },
  {
    title: "Team",
    items: [
      { href: routes.admin.users, label: "Staff", icon: Users },
      { href: routes.admin.settings, label: "Settings", icon: Settings },
    ],
  },
];
