"use client";

import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminStaffUsers } from "@/features/admin/fixtures";
import { STAFF_ROLE_LABELS } from "@/features/admin/labels";

export function UsersScreen() {
  return (
    <AdminPage
      title="Staff"
      description="Only Super Admin is enabled for now. Extra roles can be added when the backend is connected."
    >
      <AdminTable
        rows={adminStaffUsers}
        searchPlaceholder="Search name or email"
        searchText={(row) => `${row.name} ${row.email} ${row.role}`}
        empty="No staff accounts."
        columns={[
          { header: "Name", cell: (row) => row.name },
          { header: "Email", cell: (row) => row.email },
          { header: "Role", cell: (row) => STAFF_ROLE_LABELS[row.role] },
          {
            header: "Status",
            cell: (row) => (
              <StatusBadge value={row.status} label={row.status === "ACTIVE" ? "Active" : "Invited"} />
            ),
          },
        ]}
      />
    </AdminPage>
  );
}
