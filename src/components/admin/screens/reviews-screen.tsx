"use client";

import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminReviews } from "@/features/admin/fixtures";
import type { AdminReview } from "@/features/admin/types";

export function ReviewsScreen() {
  return (
    <AdminPage
      title="Reviews"
      description="Moderation queue. The storefront does not show ratings unless a review is published from real data."
    >
      <AdminTable
        rows={adminReviews}
        searchPlaceholder="Search product or customer"
        searchText={(row) => `${row.product} ${row.customer} ${row.comment}`}
        empty="No reviews yet. The storefront stays empty until a real review is published."
        columns={[
          { header: "Product", cell: (row: AdminReview) => row.product },
          { header: "Customer", cell: (row: AdminReview) => row.customer },
          { header: "Rating", cell: (row: AdminReview) => `${row.rating}/5` },
          {
            header: "Status",
            cell: (row: AdminReview) => <StatusBadge value={row.status} label={row.status.toLowerCase()} />,
          },
          { header: "Comment", cell: (row: AdminReview) => row.comment, className: "max-w-xs whitespace-normal" },
        ]}
      />
    </AdminPage>
  );
}
