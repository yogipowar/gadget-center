export const STAFF_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "SALES_MANAGER",
  "SALES_EXECUTIVE",
  "INVENTORY_MANAGER",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const PERMISSIONS = [
  "users.manage",
  "settings.manage",
  "leads.read",
  "leads.read_all",
  "leads.manage",
  "leads.convert",
  "customers.read",
  "customers.manage",
  "orders.read",
  "orders.manage",
  "products.read",
  "products.manage",
  "inventory.read",
  "inventory.manage",
  "reports.sales",
  "reports.leads",
  "reports.inventory",
] as const;

export type Permission = (typeof PERMISSIONS)[number];
