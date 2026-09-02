"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AdminField, AdminFormDialog, adminSelectClassName } from "@/components/admin/admin-form-dialog";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteCoupon, saveCoupon, useAdminCatalog } from "@/features/admin/catalog-store";
import { formatAdminDate } from "@/features/admin/labels";
import type { AdminCoupon } from "@/features/admin/types";
import { formatInr } from "@/utils/currency";

const empty = {
  code: "",
  discount: "",
  minOrder: "0",
  expiresAt: "",
  active: true,
};

export function CouponsScreen() {
  const catalog = useAdminCatalog();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [form, setForm] = useState(empty);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(row: AdminCoupon) {
    setEditing(row);
    setForm({
      code: row.code,
      discount: row.discount,
      minOrder: String(row.minOrder),
      expiresAt: row.expiresAt,
      active: row.active,
    });
    setOpen(true);
  }

  function onSave() {
    const code = form.code.trim().toUpperCase();
    if (code.length < 3 || !form.discount.trim()) {
      toast.error("Enter a coupon code and offer.");
      return;
    }
    saveCoupon({
      id: editing?.id,
      code,
      discount: form.discount.trim(),
      minOrder: Number(form.minOrder) || 0,
      uses: editing?.uses ?? 0,
      active: form.active,
      expiresAt: form.expiresAt || new Date().toISOString().slice(0, 10),
    });
    toast.success(editing ? "Coupon updated." : "Coupon added.");
    setOpen(false);
  }

  return (
    <AdminPage
      title="Coupons"
      description="Create discount codes for ads and billing. Checkout does not apply them until payments are connected."
      actions={<Button onClick={openCreate}>Add coupon</Button>}
    >
      <AdminTable
        rows={catalog.coupons}
        searchPlaceholder="Search coupon code"
        searchText={(row) => `${row.code} ${row.discount}`}
        empty="No coupons yet. Add one to get started."
        columns={[
          { header: "Code", cell: (row) => row.code },
          { header: "Offer", cell: (row) => row.discount },
          { header: "Min order", cell: (row) => formatInr(row.minOrder, { compact: true }) },
          { header: "Uses", cell: (row) => row.uses },
          {
            header: "Status",
            cell: (row) => <StatusBadge value={row.active ? "ACTIVE" : "CLOSED"} label={row.active ? "Active" : "Off"} />,
          },
          { header: "Expires", cell: (row) => formatAdminDate(row.expiresAt) },
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
                    if (window.confirm(`Delete ${row.code}?`)) {
                      deleteCoupon(row.id);
                      toast.success("Coupon deleted.");
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
      <AdminFormDialog open={open} onOpenChange={setOpen} title={editing ? "Edit coupon" : "Add coupon"} onSubmit={onSave}>
        <AdminField label="Code">
          <Input value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))} />
        </AdminField>
        <AdminField label="Offer">
          <Input
            value={form.discount}
            placeholder="5% off or ₹1,000 off"
            onChange={(event) => setForm((current) => ({ ...current, discount: event.target.value }))}
          />
        </AdminField>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Min order (INR)">
            <Input
              value={form.minOrder}
              inputMode="numeric"
              onChange={(event) => setForm((current) => ({ ...current, minOrder: event.target.value }))}
            />
          </AdminField>
          <AdminField label="Expires">
            <Input
              type="date"
              value={form.expiresAt}
              onChange={(event) => setForm((current) => ({ ...current, expiresAt: event.target.value }))}
            />
          </AdminField>
        </div>
        <AdminField label="Status">
          <select
            className={adminSelectClassName}
            value={form.active ? "1" : "0"}
            onChange={(event) => setForm((current) => ({ ...current, active: event.target.value === "1" }))}
          >
            <option value="1">Active</option>
            <option value="0">Off</option>
          </select>
        </AdminField>
      </AdminFormDialog>
    </AdminPage>
  );
}
