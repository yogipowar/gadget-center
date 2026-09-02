"use client";

import Link from "next/link";

import { AdminPage } from "@/components/admin/admin-page";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { adminCustomers, adminLeads, adminOrders } from "@/features/admin/fixtures";
import { LEAD_STATUS_LABELS, ORDER_STATUS_LABELS, formatAdminDate } from "@/features/admin/labels";
import { catalogProducts } from "@/features/catalog/products";
import { formatInr } from "@/utils/currency";
import { cn } from "@/lib/utils";

const openLeads = adminLeads.filter((lead) => !["CONVERTED", "LOST", "NOT_INTERESTED"].includes(lead.status));
const hotLeads = adminLeads.filter((lead) => lead.priority === "HOT" && lead.status !== "LOST");
const monthOrders = adminOrders.filter((order) => order.status !== "CANCELLED");
const monthSales = monthOrders.reduce((sum, order) => sum + order.total, 0);
const lowStock = catalogProducts.filter((product) => !product.inStock).length;

const stats = [
  { label: "Open leads", value: String(openLeads.length), href: routes.admin.leads },
  { label: "Hot follow-ups", value: String(hotLeads.length), href: routes.admin.leads },
  { label: "Orders (sample)", value: String(monthOrders.length), href: routes.admin.orders },
  { label: "Order value", value: formatInr(monthSales, { compact: true }), href: routes.admin.reports },
  { label: "Customers", value: String(adminCustomers.length), href: routes.admin.customers },
  { label: "Out of stock SKUs", value: String(lowStock), href: routes.admin.inventory },
];

export function DashboardScreen() {
  return (
    <AdminPage
      title="Dashboard"
      description="Today’s pipeline from Meta ads, WhatsApp and walk-ins. Figures are sample data."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="rounded-xl">
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Latest leads</CardTitle>
            <CardDescription>Newest enquiries waiting on the sales desk.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {adminLeads.slice(0, 5).map((lead) => (
                <li key={lead.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.leadNumber} · {lead.city} · {formatAdminDate(lead.createdAt)}
                    </p>
                  </div>
                  <StatusBadge value={lead.status} label={LEAD_STATUS_LABELS[lead.status]} />
                </li>
              ))}
            </ul>
            <Link href={routes.admin.leads} className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>
              Open leads
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>COD and enquiry orders from the storefront.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {adminOrders.slice(0, 5).map((order) => (
                <li key={order.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer} · {formatInr(order.total, { compact: true })}
                    </p>
                  </div>
                  <StatusBadge value={order.status} label={ORDER_STATUS_LABELS[order.status]} />
                </li>
              ))}
            </ul>
            <Link href={routes.admin.orders} className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>
              Open orders
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminPage>
  );
}
