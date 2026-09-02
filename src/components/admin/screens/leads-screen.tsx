"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { LEAD_STATUSES } from "@/constants/leads";
import { adminLeads } from "@/features/admin/fixtures";
import {
  LEAD_INTEREST_LABELS,
  LEAD_PRIORITY_LABELS,
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  formatAdminDate,
} from "@/features/admin/labels";
import type { AdminLead } from "@/features/admin/types";
import { cn } from "@/lib/utils";

export function LeadsScreen() {
  const [rows, setRows] = useState(adminLeads);

  function updateStatus(id: string, status: AdminLead["status"]) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
    toast.success("Lead status updated on this device only.");
  }

  const columns = useMemo(
    () => [
      {
        header: "Lead",
        cell: (row: AdminLead) => (
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.leadNumber}</p>
          </div>
        ),
      },
      {
        header: "Mobile",
        cell: (row: AdminLead) => row.mobile,
      },
      {
        header: "Interest",
        cell: (row: AdminLead) => LEAD_INTEREST_LABELS[row.interest],
      },
      {
        header: "Priority",
        cell: (row: AdminLead) => (
          <StatusBadge value={row.priority} label={LEAD_PRIORITY_LABELS[row.priority]} />
        ),
      },
      {
        header: "Status",
        cell: (row: AdminLead) => (
          <select
            className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs"
            value={row.status}
            onChange={(event) => updateStatus(row.id, event.target.value as AdminLead["status"])}
          >
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {LEAD_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        ),
      },
      {
        header: "Source",
        cell: (row: AdminLead) => LEAD_SOURCE_LABELS[row.source],
      },
      {
        header: "Owner",
        cell: (row: AdminLead) => row.assignedTo,
      },
      {
        header: "Date",
        cell: (row: AdminLead) => formatAdminDate(row.createdAt),
      },
      {
        header: "Contact",
        cell: (row: AdminLead) => {
          const url = `https://wa.me/91${row.mobile}?text=${encodeURIComponent(
            `Hi ${row.name}, this is GadgetCenter following up on ${LEAD_INTEREST_LABELS[row.interest]}.`,
          )}`;
          return url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              WhatsApp
            </a>
          ) : (
            "—"
          );
        },
      },
    ],
    [],
  );

  return (
    <AdminPage
      title="Leads"
      description="Meta, WhatsApp and walk-in enquiries. Status changes stay in this browser until a backend is connected."
    >
      <AdminTable
        rows={rows}
        columns={columns}
        searchPlaceholder="Search name, mobile, city or lead number"
        searchText={(row) => `${row.name} ${row.mobile} ${row.city} ${row.leadNumber} ${row.notes}`}
        empty="No leads match this search."
      />
    </AdminPage>
  );
}
