"use client";

import Link from "next/link";

import { AdminPage } from "@/components/admin/admin-page";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useAdminCatalog } from "@/features/admin/catalog-store";
import { useAdminOrders } from "@/features/admin/orders-client";
import { ORDER_STATUS_LABELS, formatAdminDate } from "@/features/admin/labels";
import { formatInr } from "@/utils/currency";
import { cn } from "@/lib/utils";

export function DashboardScreen() {
  const catalog = useAdminCatalog();
  const { orders } = useAdminOrders();
  const products = catalog.products;
  const units = products.reduce((sum, product) => sum + (product.onHand ?? 0), 0);
  const outOfStock = products.filter((product) => !product.inStock || (product.onHand ?? 0) <= 0);
  const lowStock = products.filter((product) => {
    const onHand = product.onHand ?? 0;
    return product.inStock && onHand > 0 && onHand <= 5;
  });
  const liveOrders = orders.filter((order) => order.status !== "CANCELLED");
  const orderValue = liveOrders.reduce((sum, order) => sum + order.total, 0);
  const stats = [
    { label: "Products", value: String(products.length), href: routes.admin.products },
    { label: "Units on hand", value: String(units), href: routes.admin.products },
    { label: "Out of stock", value: String(outOfStock.length), href: routes.admin.products },
    { label: "Orders", value: String(liveOrders.length), href: routes.admin.orders },
    { label: "Order value", value: formatInr(orderValue, { compact: true }), href: routes.admin.orders },
  ];

  return (
    <AdminPage title="Dashboard" description="Catalog and orders for this shop. Extra admin tools stay off until they are needed.">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
            <CardTitle>Low stock</CardTitle>
            <CardDescription>Listings with 5 or fewer units left.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">No low-stock products right now.</p>
            ) : (
              <ul className="space-y-3">
                {lowStock.slice(0, 6).map((product) => (
                  <li key={product.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sku}</p>
                    </div>
                    <p className="text-sm font-medium">{product.onHand ?? 0}</p>
                  </li>
                ))}
              </ul>
            )}
            <Link href={routes.admin.products} className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>
              Open products
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Paid online orders from the storefront.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No storefront orders yet.</p>
            ) : (
              <ul className="space-y-3">
                {orders.slice(0, 6).map((order) => (
                  <li key={order.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer} · {formatInr(order.total, { compact: true })} · {formatAdminDate(order.createdAt)}
                      </p>
                    </div>
                    <StatusBadge value={order.status} label={ORDER_STATUS_LABELS[order.status]} />
                  </li>
                ))}
              </ul>
            )}
            <Link href={routes.admin.orders} className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>
              Open orders
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminPage>
  );
}
