"use client";

import { AdminPage } from "@/components/admin/admin-page";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminCustomers, adminLeads, adminOrders } from "@/features/admin/fixtures";
import { LEAD_SOURCE_LABELS } from "@/features/admin/labels";
import { catalogProducts } from "@/features/catalog/products";
import { formatInr } from "@/utils/currency";

const closedLost = ["LOST", "NOT_INTERESTED"];
const converted = adminLeads.filter((lead) => lead.status === "CONVERTED").length;
const open = adminLeads.filter((lead) => !closedLost.includes(lead.status) && lead.status !== "CONVERTED").length;
const wonOrders = adminOrders.filter((order) => order.status !== "CANCELLED");
const revenue = wonOrders.reduce((sum, order) => sum + order.total, 0);
const sourceCounts = adminLeads.reduce<Record<string, number>>((map, lead) => {
  map[lead.source] = (map[lead.source] ?? 0) + 1;
  return map;
}, {});

export function ReportsScreen() {
  return (
    <AdminPage title="Reports" description="Simple totals from the sample dataset. Connect MySQL later for live figures.">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Lead conversion</CardDescription>
            <CardTitle>
              {converted} / {adminLeads.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Open pipeline</CardDescription>
            <CardTitle>{open} leads</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Order value</CardDescription>
            <CardTitle>{formatInr(revenue, { compact: true })}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Catalog SKUs</CardDescription>
            <CardTitle>{catalogProducts.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Leads by source</CardTitle>
          <CardDescription>{adminCustomers.length} customers on file in this demo.</CardDescription>
        </CardHeader>
        <ul className="divide-y divide-border">
          {Object.entries(sourceCounts).map(([source, count]) => (
            <li key={source} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>{LEAD_SOURCE_LABELS[source as keyof typeof LEAD_SOURCE_LABELS]}</span>
              <span className="font-medium">{count}</span>
            </li>
          ))}
        </ul>
      </Card>
    </AdminPage>
  );
}
