"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminField, AdminFormDialog, adminSelectClassName } from "@/components/admin/admin-form-dialog";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { deleteCategory, saveCategory, useAdminCatalog } from "@/features/admin/catalog-store";
import type { AdminCategory } from "@/features/admin/types";
import { slugify } from "@/utils/slug";

const empty: Omit<AdminCategory, "id"> = {
  name: "",
  slug: "",
  description: "",
  live: true,
};

export function CategoriesScreen() {
  const catalog = useAdminCatalog();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const product of catalog.products) {
      map.set(product.categorySlug, (map.get(product.categorySlug) ?? 0) + 1);
    }
    return map;
  }, [catalog.products]);

  function openCreate() {
    setEditingId(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(row: AdminCategory) {
    setEditingId(row.id);
    setForm({ name: row.name, slug: row.slug, description: row.description, live: row.live });
    setOpen(true);
  }

  function onSave() {
    const name = form.name.trim();
    const slug = slugify(form.slug || name);
    if (name.length < 2 || !slug) {
      toast.error("Enter a category name.");
      return;
    }
    saveCategory({ id: editingId ?? slug, name, slug, description: form.description.trim(), live: form.live });
    toast.success(editingId ? "Category updated." : "Category added.");
    setOpen(false);
  }

  return (
    <AdminPage
      title="Categories"
      description="Add shop categories here. They are saved in this browser and show on the store once live."
      actions={<Button onClick={openCreate}>Add category</Button>}
    >
      <AdminTable
        rows={catalog.categories}
        searchPlaceholder="Search category"
        searchText={(row) => `${row.name} ${row.slug}`}
        empty="No categories yet. Add one to get started."
        columns={[
          { header: "Name", cell: (row) => row.name },
          { header: "Slug", cell: (row) => row.slug },
          { header: "Products", cell: (row) => counts.get(row.slug) ?? 0 },
          { header: "On store", cell: (row) => (row.live ? "Visible" : "Hidden") },
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
                      deleteCategory(row.id);
                      toast.success("Category deleted.");
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
        title={editingId ? "Edit category" : "Add category"}
        onSubmit={onSave}
      >
        <AdminField label="Name">
          <Input
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                name: event.target.value,
                slug: editingId ? current.slug : slugify(event.target.value),
              }))
            }
          />
        </AdminField>
        <AdminField label="Slug">
          <Input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))} />
        </AdminField>
        <AdminField label="Description">
          <Textarea
            rows={3}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
        </AdminField>
        <AdminField label="Visibility">
          <select
            className={adminSelectClassName}
            value={form.live ? "1" : "0"}
            onChange={(event) => setForm((current) => ({ ...current, live: event.target.value === "1" }))}
          >
            <option value="1">Visible on store</option>
            <option value="0">Hidden</option>
          </select>
        </AdminField>
      </AdminFormDialog>
    </AdminPage>
  );
}
