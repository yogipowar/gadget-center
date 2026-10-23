"use client";

import { AdminPage } from "@/components/admin/admin-page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminCatalog } from "@/features/admin/catalog-store";
import { adminCustomers, adminLeads, adminOrders } from "@/features/admin/fixtures";
import { LEAD_SOURCE_LABELS, ORDER_STATUS_LABELS, formatAdminDate } from "@/features/admin/labels";
import { formatInr } from "@/utils/currency";

const closedLost = ["LOST", "NOT_INTERESTED"];

export function ReportsScreen() {
  const catalog = useAdminCatalog();
  const converted = adminLeads.filter((lead) => lead.status === "CONVERTED").length;
  const open = adminLeads.filter((lead) => !closedLost.includes(lead.status) && lead.status !== "CONVERTED").length;
  const wonOrders = adminOrders.filter((order) => order.status !== "CANCELLED");
  const revenue = wonOrders.reduce((sum, order) => sum + order.total, 0);
  const sourceCounts = adminLeads.reduce<Record<string, number>>((map, lead) => {
    map[lead.source] = (map[lead.source] ?? 0) + 1;
    return map;
  }, {});
  const onHand = catalog.inventory.reduce((sum, row) => sum + row.onHand, 0);
  const stockValue = catalog.products.reduce((sum, product) => {
    const qty = catalog.inventory.find((row) => row.id === product.id)?.onHand ?? product.onHand ?? 0;
    return sum + product.salePrice * qty;
  }, 0);
  const byBrand = catalog.products.reduce<Record<string, { skus: number; qty: number }>>((map, product) => {
    const qty = catalog.inventory.find((row) => row.id === product.id)?.onHand ?? product.onHand ?? 0;
    const current = map[product.brand] ?? { skus: 0, qty: 0 };
    map[product.brand] = { skus: current.skus + 1, qty: current.qty + qty };
    return map;
  }, {});

  return (
    <AdminPage
      title="Reports"
      description="Catalog and stock figures come from products saved on this device. Lead and order totals are sample data until a database is connected."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Catalog SKUs</CardDescription>
            <CardTitle>{catalog.products.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Units on hand</CardDescription>
            <CardTitle>{onHand}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Stock value</CardDescription>
            <CardTitle>{formatInr(stockValue, { compact: true })}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Sample order value</CardDescription>
            <CardTitle>{formatInr(revenue, { compact: true })}</CardTitle>
          </CardHeader>
        </Card>
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
            <CardDescription>Sample customers</CardDescription>
            <CardTitle>{adminCustomers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Sample orders</CardDescription>
            <CardTitle>{wonOrders.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Stock by brand</CardTitle>
            <CardDescription>From the live catalog on this device.</CardDescription>
          </CardHeader>
          <ul className="divide-y divide-border">
            {Object.entries(byBrand).map(([brand, stats]) => (
              <li key={brand} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{brand}</span>
                <span className="font-medium">
                  {stats.skus} SKUs · {stats.qty} units
                </span>
              </li>
            ))}
            {Object.keys(byBrand).length === 0 ? (
              <li className="px-4 py-6 text-sm text-muted-foreground">No products in the catalog.</li>
            ) : null}
          </ul>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Leads by source</CardTitle>
            <CardDescription>Sample leads until the API is connected.</CardDescription>
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
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Recent sample orders</CardTitle>
          <CardDescription>Fixture orders for the current refurbished stock list.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="divide-y divide-border">
            {adminOrders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customer} · {order.items} · {formatAdminDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatInr(order.total, { compact: true })}</p>
                  <p className="text-xs text-muted-foreground">{ORDER_STATUS_LABELS[order.status]}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </AdminPage>
  );
}
