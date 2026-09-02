"use client";

import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminEnquiries } from "@/features/admin/fixtures";
import { formatAdminDate } from "@/features/admin/labels";
import type { AdminEnquiry } from "@/features/admin/types";

export function EnquiriesScreen() {
  return (
    <AdminPage title="Enquiries" description="Product WhatsApp, form and phone requests that are not yet converted to an order.">
      <AdminTable
        rows={adminEnquiries}
        searchPlaceholder="Search name, mobile or product"
        searchText={(row) => `${row.name} ${row.mobile} ${row.product}`}
        empty="No enquiries match this search."
        columns={[
          { header: "Name", cell: (row: AdminEnquiry) => row.name },
          { header: "Mobile", cell: (row: AdminEnquiry) => row.mobile },
          { header: "Product", cell: (row: AdminEnquiry) => row.product },
          { header: "Channel", cell: (row: AdminEnquiry) => row.channel },
          {
            header: "Status",
            cell: (row: AdminEnquiry) => <StatusBadge value={row.status} label={row.status.toLowerCase()} />,
          },
          { header: "Date", cell: (row: AdminEnquiry) => formatAdminDate(row.createdAt) },
        ]}
      />
    </AdminPage>
  );
}
