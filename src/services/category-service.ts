import "server-only";

import { randomUUID } from "node:crypto";
import { Op } from "sequelize";

import { ShopCategory } from "@/database/models/shop-category";
import { ensureDatabase } from "@/database/sequelize";
import { builtinAdminCategories, mergeAdminCategories } from "@/features/catalog/queries";
import type { AdminCategory } from "@/features/admin/types";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/api/errors";
import { slugify } from "@/utils/slug";

function fromRow(row: ShopCategory): AdminCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    live: Boolean(row.live),
    builtin: false,
  };
}

function builtinSlugs() {
  return new Set<string>(builtinAdminCategories().map((item) => item.slug));
}

export async function listCategories() {
  await ensureDatabase();
  const rows = await ShopCategory.findAll({ order: [["created_at", "ASC"]] });
  return mergeAdminCategories(rows.map(fromRow));
}

export async function upsertCategory(input: Partial<AdminCategory> & { name: string; slug?: string }) {
  await ensureDatabase();
  const name = input.name.trim();
  const slug = slugify(input.slug || name);
  if (name.length < 2 || !slug) {
    throw new ValidationError("Enter a category name.");
  }
  if (input.id && builtinSlugs().has(input.id)) {
    throw new ValidationError("Built-in categories cannot be changed.");
  }
  if (builtinSlugs().has(slug)) {
    throw new ConflictError("That category already exists.");
  }

  const duplicate = await ShopCategory.findOne({
    where: {
      slug,
      ...(input.id ? { id: { [Op.ne]: input.id } } : {}),
    },
  });
  if (duplicate) {
    throw new ConflictError("A category with this URL already exists.");
  }

  if (input.id) {
    const existing = await ShopCategory.findByPk(input.id);
    if (!existing) {
      throw new NotFoundError("Category not found.");
    }
    if (builtinSlugs().has(existing.slug)) {
      throw new ValidationError("Built-in categories cannot be changed.");
    }
    await existing.update({
      name,
      slug,
      description: input.description?.trim() ?? "",
      live: input.live !== false,
    });
    return fromRow(existing);
  }

  const created = await ShopCategory.create({
    id: randomUUID(),
    name,
    slug,
    description: input.description?.trim() ?? "",
    live: input.live !== false,
  });
  return fromRow(created);
}

export async function removeCategory(id: string) {
  await ensureDatabase();
  const existing = await ShopCategory.findByPk(id);
  if (!existing) {
    throw new NotFoundError("Category not found.");
  }
  if (builtinSlugs().has(existing.slug)) {
    throw new ValidationError("Built-in categories cannot be deleted.");
  }
  await existing.destroy();
  return 1;
}
