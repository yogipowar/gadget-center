"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AdminField, AdminFormDialog, adminSelectClassName } from "@/components/admin/admin-form-dialog";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminTable } from "@/components/admin/admin-table";
import { ProductImagesField } from "@/components/admin/product-images-field";
import { StoreImage } from "@/components/product/store-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  PRODUCT_CONDITIONS,
  PRODUCT_TYPES,
  REFURBISHED_GRADE_LABELS,
  REFURBISHED_GRADES,
  type ProductCondition,
  type ProductType,
  type RefurbishedGrade,
} from "@/constants/products";
import { createRecordId, deleteProduct, deleteProducts, saveProduct, useAdminCatalog } from "@/features/admin/catalog-store";
import { conditionLabel } from "@/features/catalog/queries";
import type { CatalogProduct } from "@/features/catalog/types";
import { formatInr } from "@/utils/currency";
import { slugify } from "@/utils/slug";

type ProductForm = {
  name: string;
  sku: string;
  slug: string;
  brand: string;
  categorySlug: string;
  productType: ProductType;
  condition: ProductCondition;
  grade: RefurbishedGrade | "";
  price: string;
  salePrice: string;
  warranty: string;
  specs: string;
  shortDescription: string;
  onHand: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  images: string[];
};

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  slug: "",
  brand: "",
  categorySlug: "",
  productType: "LAPTOP",
  condition: "REFURBISHED",
  grade: "",
  price: "",
  salePrice: "",
  warranty: "",
  specs: "",
  shortDescription: "",
  onHand: "5",
  featured: false,
  bestseller: false,
  newArrival: true,
  images: [],
};

function toForm(product: CatalogProduct, onHand: number): ProductForm {
  return {
    name: product.name,
    sku: product.sku,
    slug: product.slug,
    brand: product.brand,
    categorySlug: product.categorySlug,
    productType: product.productType,
    condition: product.condition,
    grade: product.grade ?? "",
    price: String(product.price),
    salePrice: String(product.salePrice),
    warranty: product.warranty,
    specs: product.specs.join(", "),
    shortDescription: product.shortDescription,
    onHand: String(onHand),
    featured: product.featured,
    bestseller: product.bestseller,
    newArrival: product.newArrival,
    images: product.images?.length ? product.images : product.image ? [product.image] : [],
  };
}

export function ProductsScreen() {
  const catalog = useAdminCatalog();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [uploadingImages, setUploadingImages] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      brand: catalog.brands.find((brand) => brand.live)?.name ?? catalog.brands[0]?.name ?? "",
      categorySlug:
        catalog.categories.find((category) => category.slug === "refurbished-laptops")?.slug ??
        catalog.categories[0]?.slug ??
        "",
    });
    setOpen(true);
  }

  function openEdit(product: CatalogProduct) {
    const stock = catalog.inventory.find((row) => row.id === product.id);
    setEditingId(product.id);
    setForm(toForm(product, stock?.onHand ?? (product.inStock ? 1 : 0)));
    setOpen(true);
  }

  async function onSave() {
    if (uploadingImages) {
      toast.error("Wait for images to finish uploading.");
      return;
    }
    const name = form.name.trim();
    const sku = form.sku.trim();
    const brand = form.brand.trim();
    const categorySlug = form.categorySlug.trim();
    const price = Number(form.price);
    const salePrice = Number(form.salePrice || form.price);
    const onHand = Number(form.onHand);
    if (name.length < 3 || !sku || !brand || !categorySlug) {
      toast.error("Name, SKU, brand and category are required.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Enter a valid price.");
      return;
    }
    const slug = slugify(form.slug || name);
    const duplicateSlug = catalog.products.some((item) => item.slug === slug && item.id !== editingId);
    if (duplicateSlug) {
      toast.error("That product URL slug is already used.");
      return;
    }
    const current = editingId ? catalog.products.find((item) => item.id === editingId) : undefined;
    setSaving(true);
    try {
      await saveProduct({
        id: editingId || createRecordId("p"),
        sku,
        slug,
        name,
        brand,
        categorySlug,
        productType: form.productType,
        condition: form.condition,
        grade: form.condition === "REFURBISHED" && form.grade ? form.grade : undefined,
        price,
        salePrice: Number.isFinite(salePrice) && salePrice > 0 ? salePrice : price,
        warranty: form.warranty.trim(),
        specs: form.specs.split(",").map((item) => item.trim()).filter(Boolean),
        shortDescription: form.shortDescription.trim() || name,
        featured: form.featured,
        bestseller: form.bestseller,
        newArrival: form.newArrival,
        inStock: onHand > 0,
        accent: current?.accent ?? "navy",
        image: form.images[0],
        images: form.images,
        onHand: Number.isFinite(onHand) ? Math.max(0, onHand) : 0,
      });
      toast.success(editingId ? "Product updated." : "Product added. It will show in the store catalog.");
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the product.");
    } finally {
      setSaving(false);
    }
  }

  async function onBulkDelete() {
    if (selectedIds.length === 0) {
      return;
    }
    if (!window.confirm(`Delete ${selectedIds.length} selected product${selectedIds.length === 1 ? "" : "s"}?`)) {
      return;
    }
    try {
      await deleteProducts(selectedIds);
      setSelectedIds([]);
      toast.success("Selected products deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete products.");
    }
  }

  return (
    <AdminPage
      title="Products"
      description="Add, edit or delete SKUs. Changes are saved to the shop database and show on the storefront."
      actions={
        <div className="flex flex-wrap gap-2">
          {selectedIds.length > 0 ? (
            <Button variant="destructive" onClick={onBulkDelete}>
              Delete selected ({selectedIds.length})
            </Button>
          ) : null}
          <Button onClick={openCreate}>Add product</Button>
        </div>
      }
    >
      <AdminTable
        rows={catalog.products}
        searchPlaceholder="Search name, SKU or brand"
        searchText={(row) => `${row.name} ${row.sku} ${row.brand} ${row.categorySlug}`}
        empty="No products yet. Add one to get started."
        getRowId={(row) => row.id}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        columns={[
          {
            header: "Product",
            cell: (row) => (
              <div className="flex items-center gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-md border bg-zinc-50">
                  {row.image ? (
                    <StoreImage src={row.image} alt="" fill sizes="40px" className="object-contain p-0.5" />
                  ) : (
                    <span className="block size-full bg-zinc-100" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.sku}</p>
                </div>
              </div>
            ),
          },
          { header: "Brand", cell: (row) => row.brand },
          { header: "Category", cell: (row) => row.categorySlug },
          {
            header: "Condition",
            cell: (row) => (
              <Badge variant={row.condition === "REFURBISHED" ? "secondary" : "outline"}>
                {conditionLabel(row)}
              </Badge>
            ),
          },
          { header: "Price", cell: (row) => formatInr(row.salePrice, { compact: true }) },
          {
            header: "Qty",
            cell: (row) => catalog.inventory.find((item) => item.id === row.id)?.onHand ?? row.onHand ?? 0,
          },
          { header: "Stock", cell: (row) => (row.inStock ? "In stock" : "Out of stock") },
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
                  onClick={async () => {
                    if (!window.confirm(`Delete ${row.name}?`)) {
                      return;
                    }
                    try {
                      await deleteProduct(row.id);
                      toast.success("Product deleted.");
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Could not delete the product.");
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
        title={editingId ? "Edit product" : "Add product"}
        description="Prices are in INR. Specs can be a comma-separated list. Upload multiple product photos."
        onSubmit={onSave}
        submitLabel={saving ? "Saving…" : uploadingImages ? "Uploading…" : "Save"}
        submitDisabled={saving || uploadingImages}
        contentClassName="max-h-[90vh] overflow-y-auto sm:max-w-xl"
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
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="SKU">
            <Input value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} />
          </AdminField>
          <AdminField label="URL slug">
            <Input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))} />
          </AdminField>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Brand">
            <select
              className={adminSelectClassName}
              value={form.brand}
              onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))}
            >
              <option value="">Select brand</option>
              {catalog.brands.filter((brand) => brand.live).map((brand) => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Category">
            <select
              className={adminSelectClassName}
              value={form.categorySlug}
              onChange={(event) => setForm((current) => ({ ...current, categorySlug: event.target.value }))}
            >
              <option value="">Select category</option>
              {catalog.categories.filter((category) => category.live).map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </AdminField>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="Type">
            <select
              className={adminSelectClassName}
              value={form.productType}
              onChange={(event) => setForm((current) => ({ ...current, productType: event.target.value as ProductType }))}
            >
              {PRODUCT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Condition">
            <select
              className={adminSelectClassName}
              value={form.condition}
              onChange={(event) => setForm((current) => ({ ...current, condition: event.target.value as ProductCondition }))}
            >
              {PRODUCT_CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </AdminField>
        </div>
        {form.condition === "REFURBISHED" ? (
          <AdminField label="Grade">
            <select
              className={adminSelectClassName}
              value={form.grade}
              onChange={(event) => setForm((current) => ({ ...current, grade: event.target.value as RefurbishedGrade | "" }))}
            >
              <option value="">Select grade</option>
              {REFURBISHED_GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  {REFURBISHED_GRADE_LABELS[grade]}
                </option>
              ))}
            </select>
          </AdminField>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-3">
          <AdminField label="MRP">
            <Input value={form.price} inputMode="numeric" onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} />
          </AdminField>
          <AdminField label="Selling price">
            <Input
              value={form.salePrice}
              inputMode="numeric"
              onChange={(event) => setForm((current) => ({ ...current, salePrice: event.target.value }))}
            />
          </AdminField>
          <AdminField label="Qty on hand">
            <Input value={form.onHand} inputMode="numeric" onChange={(event) => setForm((current) => ({ ...current, onHand: event.target.value }))} />
          </AdminField>
        </div>
        <ProductImagesField
          images={form.images}
          onChange={(images) => setForm((current) => ({ ...current, images }))}
          onBusyChange={setUploadingImages}
        />
        <AdminField label="Warranty">
          <Input value={form.warranty} onChange={(event) => setForm((current) => ({ ...current, warranty: event.target.value }))} />
        </AdminField>
        <AdminField label="Short description">
          <Textarea
            rows={2}
            value={form.shortDescription}
            onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))}
          />
        </AdminField>
        <AdminField label="Specs">
          <Input
            value={form.specs}
            placeholder="16GB RAM, 512GB SSD"
            onChange={(event) => setForm((current) => ({ ...current, specs: event.target.value }))}
          />
        </AdminField>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
            />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.bestseller}
              onChange={(event) => setForm((current) => ({ ...current, bestseller: event.target.checked }))}
            />
            Bestseller
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.newArrival}
              onChange={(event) => setForm((current) => ({ ...current, newArrival: event.target.checked }))}
            />
            New arrival
          </label>
        </div>
      </AdminFormDialog>
    </AdminPage>
  );
}
