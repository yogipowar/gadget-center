"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AdminField, AdminFormDialog, adminSelectClassName } from "@/components/admin/admin-form-dialog";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteBanner, saveBanner, useAdminCatalog } from "@/features/admin/catalog-store";
import { formatAdminDate } from "@/features/admin/labels";
import type { AdminBanner } from "@/features/admin/types";

const empty = {
  title: "",
  placement: "Homepage hero",
  active: true,
  startsAt: "",
  endsAt: "",
};

export function BannersScreen() {
  const catalog = useAdminCatalog();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBanner | null>(null);
  const [form, setForm] = useState(empty);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(row: AdminBanner) {
    setEditing(row);
    setForm({
      title: row.title,
      placement: row.placement,
      active: row.active,
      startsAt: row.startsAt,
      endsAt: row.endsAt,
    });
    setOpen(true);
  }

  function onSave() {
    if (form.title.trim().length < 4) {
      toast.error("Enter a banner title.");
      return;
    }
    saveBanner({
      id: editing?.id,
      title: form.title.trim(),
      placement: form.placement.trim() || "Homepage",
      active: form.active,
      startsAt: form.startsAt || new Date().toISOString().slice(0, 10),
      endsAt: form.endsAt || new Date().toISOString().slice(0, 10),
    });
    toast.success(editing ? "Banner updated." : "Banner added.");
    setOpen(false);
  }

  return (
    <AdminPage
      title="Banners"
      description="Homepage and category promotions. Add a banner here, then wire it onto the storefront later if needed."
      actions={<Button onClick={openCreate}>Add banner</Button>}
    >
      <AdminTable
        rows={catalog.banners}
        searchPlaceholder="Search banner"
        searchText={(row) => `${row.title} ${row.placement}`}
        empty="No banners yet. Add one to get started."
        columns={[
          { header: "Title", cell: (row) => row.title },
          { header: "Placement", cell: (row) => row.placement },
          {
            header: "Status",
            cell: (row) => (
              <StatusBadge value={row.active ? "ACTIVE" : "CLOSED"} label={row.active ? "Live" : "Off"} />
            ),
          },
          { header: "Starts", cell: (row) => formatAdminDate(row.startsAt) },
          { header: "Ends", cell: (row) => formatAdminDate(row.endsAt) },
          {
            header: "Actions",
            cell: (row) => (
              <div className="flex justify-end gap-1">
                <Button variant="outline" size="sm" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (window.confirm(`Delete ${row.title}?`)) {
                      deleteBanner(row.id);
                      toast.success("Banner deleted.");
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />
      <AdminFormDialog open={open} onOpenChange={setOpen} title={editing ? "Edit banner" : "Add banner"} onSubmit={onSave}>
        <AdminField label="Title">
          <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
        </AdminField>
        <AdminField label="Placement">
          <Input
            value={form.placement}
            onChange={(event) => setForm((current) => ({ ...current, placement: event.target.value }))}
          />
        </AdminField>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Starts">
            <Input type="date" value={form.startsAt} onChange={(event) => setForm((current) => ({ ...current, startsAt: event.target.value }))} />
          </AdminField>
          <AdminField label="Ends">
            <Input type="date" value={form.endsAt} onChange={(event) => setForm((current) => ({ ...current, endsAt: event.target.value }))} />
          </AdminField>
        </div>
        <AdminField label="Status">
          <select
            className={adminSelectClassName}
            value={form.active ? "1" : "0"}
            onChange={(event) => setForm((current) => ({ ...current, active: event.target.value === "1" }))}
          >
            <option value="1">Live</option>
            <option value="0">Off</option>
          </select>
        </AdminField>
      </AdminFormDialog>
    </AdminPage>
  );
}
