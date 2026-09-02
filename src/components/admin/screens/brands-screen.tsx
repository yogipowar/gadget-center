"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminField, AdminFormDialog, adminSelectClassName } from "@/components/admin/admin-form-dialog";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteBrand, saveBrand, useAdminCatalog } from "@/features/admin/catalog-store";
import type { AdminBrand } from "@/features/admin/types";
import { slugify } from "@/utils/slug";

export function BrandsScreen() {
  const catalog = useAdminCatalog();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [live, setLive] = useState(true);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const product of catalog.products) {
      map.set(product.brand, (map.get(product.brand) ?? 0) + 1);
    }
    return map;
  }, [catalog.products]);

  function openCreate() {
    setEditingId(null);
    setName("");
    setLive(true);
    setOpen(true);
  }

  function openEdit(row: AdminBrand) {
    setEditingId(row.id);
    setName(row.name);
    setLive(row.live);
    setOpen(true);
  }

  function onSave() {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      toast.error("Enter a brand name.");
      return;
    }
    saveBrand({ id: editingId ?? slugify(trimmed), name: trimmed, live });
    toast.success(editingId ? "Brand updated." : "Brand added.");
    setOpen(false);
  }

  return (
    <AdminPage
      title="Brands"
      description="Add Dell, HP, Hikvision and any other brand you sell. Pick them when you add a product."
      actions={<Button onClick={openCreate}>Add brand</Button>}
    >
      <AdminTable
        rows={catalog.brands}
        searchPlaceholder="Search brand"
        searchText={(row) => row.name}
        empty="No brands yet. Add one to get started."
        columns={[
          { header: "Brand", cell: (row) => row.name },
          { header: "Products", cell: (row) => counts.get(row.name) ?? 0 },
          { header: "Status", cell: (row) => (row.live ? "Active" : "Hidden") },
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
                    if (window.confirm(`Delete ${row.name}?`)) {
                      deleteBrand(row.id);
                      toast.success("Brand deleted.");
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
      <AdminFormDialog
        open={open}
        onOpenChange={setOpen}
        title={editingId ? "Edit brand" : "Add brand"}
        onSubmit={onSave}
      >
        <AdminField label="Name">
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </AdminField>
        <AdminField label="Status">
          <select className={adminSelectClassName} value={live ? "1" : "0"} onChange={(event) => setLive(event.target.value === "1")}>
            <option value="1">Active</option>
            <option value="0">Hidden</option>
          </select>
        </AdminField>
      </AdminFormDialog>
    </AdminPage>
  );
}
