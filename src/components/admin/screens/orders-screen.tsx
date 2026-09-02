"use client";

import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminOrders } from "@/features/admin/fixtures";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  formatAdminDate,
} from "@/features/admin/labels";
import type { AdminOrder } from "@/features/admin/types";
import { formatInr } from "@/utils/currency";

export function OrdersScreen() {
  return (
    <AdminPage title="Orders" description="COD and enquiry orders. Online payment can attach to this same list later.">
      <AdminTable
        rows={adminOrders}
        searchPlaceholder="Search order number, customer or mobile"
        searchText={(row) => `${row.orderNumber} ${row.customer} ${row.mobile} ${row.items}`}
        empty="No orders match this search."
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
        ]}
      />
    </AdminPage>
  );
}
