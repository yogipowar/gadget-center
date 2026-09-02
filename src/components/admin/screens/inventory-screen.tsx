"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AdminField, AdminFormDialog } from "@/components/admin/admin-form-dialog";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveInventory, useAdminCatalog } from "@/features/admin/catalog-store";
import type { AdminInventoryRow } from "@/features/admin/types";

export function InventoryScreen() {
  const catalog = useAdminCatalog();
  const [editing, setEditing] = useState<AdminInventoryRow | null>(null);
  const [onHand, setOnHand] = useState("");
  const [reorderAt, setReorderAt] = useState("");

  function onSave() {
    if (!editing) {
      return;
    }
    const qty = Number(onHand);
    const reorder = Number(reorderAt);
    if (!Number.isFinite(qty) || qty < 0) {
      toast.error("Enter a valid quantity.");
      return;
    }
    saveInventory({
      ...editing,
      onHand: qty,
      reorderAt: Number.isFinite(reorder) ? reorder : editing.reorderAt,
    });
    toast.success("Stock updated.");
    setEditing(null);
  }

  return (
    <AdminPage title="Inventory" description="Adjust on-hand quantity. This also marks the product in or out of stock.">
      <AdminTable
        rows={catalog.inventory}
        searchPlaceholder="Search SKU or product"
        searchText={(row) => `${row.sku} ${row.name}`}
        empty="No stock rows. Add a product first."
        columns={[
          { header: "SKU", cell: (row) => row.sku },
          { header: "Product", cell: (row) => row.name },
          { header: "On hand", cell: (row) => row.onHand },
          { header: "Reserved", cell: (row) => row.reserved },
          { header: "Reorder at", cell: (row) => row.reorderAt },
          { header: "Alert", cell: (row) => (row.onHand <= row.reorderAt ? "Low stock" : "OK") },
          {
            header: "Actions",
            cell: (row) => (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(row);
                    setOnHand(String(row.onHand));
                    setReorderAt(String(row.reorderAt));
                  }}
                >
                  Adjust
                </Button>
              </div>
            ),
          },
        ]}
      />
      <AdminFormDialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
          }
        }}
        title="Adjust stock"
        onSubmit={onSave}
      >
        <p className="text-sm text-muted-foreground">{editing?.name}</p>
        <AdminField label="On hand">
          <Input value={onHand} inputMode="numeric" onChange={(event) => setOnHand(event.target.value)} />
        </AdminField>
        <AdminField label="Reorder at">
          <Input value={reorderAt} inputMode="numeric" onChange={(event) => setReorderAt(event.target.value)} />
        </AdminField>
      </AdminFormDialog>
    </AdminPage>
  );
}
