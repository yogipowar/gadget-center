import "server-only";

import { Op } from "sequelize";

import { Product } from "@/database/models/product";
import { fromCatalogProduct, toCatalogProduct } from "@/database/product-mapper";
import { ensureDatabase } from "@/database/sequelize";
import type { CatalogProduct } from "@/features/catalog/types";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/api/errors";

export async function listProducts() {
  await ensureDatabase();
  const rows = await Product.findAll({ order: [["created_at", "DESC"]] });
  return rows.map(toCatalogProduct);
}

export async function getProductBySlug(slug: string) {
  await ensureDatabase();
  const row = await Product.findOne({ where: { slug } });
  return row ? toCatalogProduct(row) : null;
}

export async function getProductById(id: string) {
  await ensureDatabase();
  const row = await Product.findByPk(id);
  return row ? toCatalogProduct(row) : null;
}

export async function upsertProduct(input: CatalogProduct) {
  await ensureDatabase();
  if (!input.name?.trim() || !input.sku?.trim() || !input.slug?.trim()) {
    throw new ValidationError("Name, SKU and slug are required.");
  }
  const duplicate = await Product.findOne({
    where: {
      [Op.or]: [{ slug: input.slug }, { sku: input.sku }],
      id: { [Op.ne]: input.id },
    },
  });
  if (duplicate) {
    throw new ConflictError("A product with this SKU or URL already exists.");
  }
  const payload = fromCatalogProduct(input);
  const existing = await Product.findByPk(input.id);
  if (existing) {
    await existing.update(payload);
    return toCatalogProduct(existing);
  }
  const created = await Product.create(payload);
  return toCatalogProduct(created);
}

export async function removeProducts(ids: string[]) {
  await ensureDatabase();
  if (ids.length === 0) {
    return 0;
  }
  return Product.destroy({ where: { id: ids } });
}

export async function reduceStock(productId: string, quantity: number) {
  const row = await Product.findByPk(productId);
  if (!row) {
    throw new NotFoundError("Product not found.");
  }
  const next = Math.max(0, row.onHand - quantity);
  await row.update({ onHand: next, inStock: next > 0 });
}
