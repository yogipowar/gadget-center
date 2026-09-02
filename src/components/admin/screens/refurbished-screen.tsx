"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AdminField, AdminFormDialog, adminSelectClassName } from "@/components/admin/admin-form-dialog";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { REFURBISHED_UNIT_STATUSES } from "@/constants/inventory";
import { REFURBISHED_GRADE_LABELS, REFURBISHED_GRADES, type RefurbishedGrade } from "@/constants/products";
import { deleteRefurbished, saveRefurbished, useAdminCatalog } from "@/features/admin/catalog-store";
import { UNIT_STATUS_LABELS } from "@/features/admin/labels";
import type { AdminRefurbishedUnit } from "@/features/admin/types";
import type { RefurbishedUnitStatus } from "@/constants/inventory";

const empty = {
  serial: "",
  product: "",
  grade: "A" as RefurbishedGrade,
  status: "AVAILABLE" as RefurbishedUnitStatus,
  batteryHealth: "90%",
  warranty: "6 months in-house warranty",
};

export function RefurbishedScreen() {
  const catalog = useAdminCatalog();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminRefurbishedUnit | null>(null);
  const [form, setForm] = useState(empty);
  const refurbishedProducts = catalog.products.filter((product) => product.condition === "REFURBISHED");

  function openCreate() {
    setEditing(null);
    setForm({ ...empty, product: refurbishedProducts[0]?.name ?? "" });
    setOpen(true);
  }

  function openEdit(row: AdminRefurbishedUnit) {
    setEditing(row);
    setForm({
      serial: row.serial,
      product: row.product,
      grade: row.grade,
      status: row.status,
      batteryHealth: row.batteryHealth,
      warranty: row.warranty,
    });
    setOpen(true);
  }

  function onSave() {
    if (form.serial.trim().length < 3 || !form.product.trim()) {
      toast.error("Enter a serial number and product.");
      return;
    }
    saveRefurbished({
      id: editing?.id,
      serial: form.serial.trim(),
      product: form.product.trim(),
      grade: form.grade,
      status: form.status,
      batteryHealth: form.batteryHealth.trim(),
      warranty: form.warranty.trim(),
    });
    toast.success(editing ? "Unit updated." : "Unit added.");
    setOpen(false);
  }

  return (
    <AdminPage
      title="Refurbished units"
      description="Track each machine by serial, grade and battery health. Do not invent missing test results."
      actions={<Button onClick={openCreate}>Add unit</Button>}
    >
      <AdminTable
        rows={catalog.refurbished}
        searchPlaceholder="Search serial or product"
        searchText={(row) => `${row.serial} ${row.product}`}
        empty="No refurbished units yet. Add one to get started."
        columns={[
          { header: "Serial", cell: (row) => row.serial },
          { header: "Product", cell: (row) => row.product },
          { header: "Grade", cell: (row) => REFURBISHED_GRADE_LABELS[row.grade] },
          {
            header: "Status",
            cell: (row) => <StatusBadge value={row.status} label={UNIT_STATUS_LABELS[row.status]} />,
          },
          { header: "Battery", cell: (row) => row.batteryHealth },
          { header: "Warranty", cell: (row) => row.warranty },
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
                    if (window.confirm(`Delete ${row.serial}?`)) {
                      deleteRefurbished(row.id);
                      toast.success("Unit deleted.");
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
      <AdminFormDialog open={open} onOpenChange={setOpen} title={editing ? "Edit unit" : "Add unit"} onSubmit={onSave}>
        <AdminField label="Serial">
          <Input value={form.serial} onChange={(event) => setForm((current) => ({ ...current, serial: event.target.value }))} />
        </AdminField>
        <AdminField label="Product">
          <select
            className={adminSelectClassName}
            value={form.product}
            onChange={(event) => setForm((current) => ({ ...current, product: event.target.value }))}
          >
            <option value="">Select product</option>
            {refurbishedProducts.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </AdminField>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Grade">
            <select
              className={adminSelectClassName}
              value={form.grade}
              onChange={(event) => setForm((current) => ({ ...current, grade: event.target.value as RefurbishedGrade }))}
            >
              {REFURBISHED_GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  {REFURBISHED_GRADE_LABELS[grade]}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Status">
            <select
              className={adminSelectClassName}
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({ ...current, status: event.target.value as RefurbishedUnitStatus }))
              }
            >
              {REFURBISHED_UNIT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {UNIT_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </AdminField>
        </div>
        <AdminField label="Battery health">
          <Input
            value={form.batteryHealth}
            onChange={(event) => setForm((current) => ({ ...current, batteryHealth: event.target.value }))}
          />
        </AdminField>
        <AdminField label="Warranty">
          <Input value={form.warranty} onChange={(event) => setForm((current) => ({ ...current, warranty: event.target.value }))} />
        </AdminField>
      </AdminFormDialog>
    </AdminPage>
  );
}
