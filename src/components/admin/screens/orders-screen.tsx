"use client";

import { toast } from "sonner";

import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { useAdminOrders } from "@/features/admin/orders-client";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  formatAdminDate,
} from "@/features/admin/labels";
import type { AdminOrder } from "@/features/admin/types";
import { formatInr } from "@/utils/currency";

export function OrdersScreen() {
  const { orders, loaded, markPaid } = useAdminOrders();

  async function onMarkPaid(order: AdminOrder) {
    try {
      await markPaid(order.id);
      toast.success(`${order.orderNumber} marked as paid.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the order.");
    }
  }

  return (
    <AdminPage title="Orders" description="UPI and bank-transfer orders from the storefront. Mark paid after you see the credit.">
      <AdminTable
        rows={orders}
        searchPlaceholder="Search order number, customer or mobile"
        searchText={(row) => `${row.orderNumber} ${row.customer} ${row.mobile} ${row.items}`}
        empty={loaded ? "No orders yet." : "Loading orders…"}
        columns={[
          { header: "Order", cell: (row: AdminOrder) => row.orderNumber },
          { header: "Customer", cell: (row: AdminOrder) => row.customer },
          { header: "Items", cell: (row: AdminOrder) => row.items },
          { header: "Total", cell: (row: AdminOrder) => formatInr(row.total, { compact: true }) },
          {
            header: "Status",
            cell: (row: AdminOrder) => (
              <StatusBadge value={row.status} label={ORDER_STATUS_LABELS[row.status]} />
            ),
          },
          {
            header: "Payment",
            cell: (row: AdminOrder) => (
              <StatusBadge value={row.paymentStatus} label={PAYMENT_STATUS_LABELS[row.paymentStatus]} />
            ),
          },
          { header: "Method", cell: (row: AdminOrder) => PAYMENT_METHOD_LABELS[row.paymentMethod] },
          { header: "Date", cell: (row: AdminOrder) => formatAdminDate(row.createdAt) },
          {
            header: "",
            cell: (row: AdminOrder) =>
              row.paymentStatus === "PENDING" ? (
                <Button type="button" size="sm" variant="outline" onClick={() => void onMarkPaid(row)}>
                  Mark paid
                </Button>
              ) : null,
          },
        ]}
      />
    </AdminPage>
  );
}
