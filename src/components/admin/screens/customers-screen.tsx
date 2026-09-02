"use client";

import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { adminCustomers } from "@/features/admin/fixtures";
import { formatAdminDate } from "@/features/admin/labels";
import type { AdminCustomer } from "@/features/admin/types";
import { formatInr } from "@/utils/currency";

export function CustomersScreen() {
  return (
    <AdminPage title="Customers" description="Buyers converted from leads or walk-in orders.">
      <AdminTable
        rows={adminCustomers}
        searchPlaceholder="Search name, mobile, email or city"
        searchText={(row) => `${row.name} ${row.mobile} ${row.email} ${row.city}`}
        empty="No customers match this search."
        columns={[
          { header: "Name", cell: (row: AdminCustomer) => row.name },
          { header: "Mobile", cell: (row: AdminCustomer) => row.mobile },
          { header: "Email", cell: (row: AdminCustomer) => row.email },
          { header: "City", cell: (row: AdminCustomer) => row.city },
          { header: "Orders", cell: (row: AdminCustomer) => row.orders },
          { header: "Spend", cell: (row: AdminCustomer) => formatInr(row.totalSpend, { compact: true }) },
          { header: "Last order", cell: (row: AdminCustomer) => formatAdminDate(row.lastOrderAt) },
        ]}
      />
    </AdminPage>
  );
}
