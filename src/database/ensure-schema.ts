import "server-only";

import type { Model, ModelStatic } from "sequelize";

import { models, sequelize } from "@/database/models";
import { logger } from "@/lib/logger";

function tableNameOf(model: ModelStatic<Model>) {
  const name = model.getTableName();
  return typeof name === "string" ? name : name.tableName;
}

function columnNames(description: Record<string, unknown>) {
  return new Set(Object.keys(description).map((name) => name.toLowerCase()));
}

function hasColumn(description: Record<string, unknown>, field: string) {
  return columnNames(description).has(field.toLowerCase());
}

const attributeKeysCache = new Map<string, string[]>();

function isPrimitiveDefault(value: unknown) {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}

export async function existingAttributeKeys(model: ModelStatic<Model>) {
  const table = tableNameOf(model);
  const cached = attributeKeysCache.get(table);
  if (cached) {
    return cached;
  }
  const description = await sequelize.getQueryInterface().describeTable(table);
  const keys = Object.entries(model.rawAttributes)
    .filter(([, attribute]) => Boolean(attribute.field && hasColumn(description, attribute.field)))
    .map(([key]) => key);
  attributeKeysCache.set(table, keys);
  return keys;
}

export async function ensureModelColumns() {
  attributeKeysCache.clear();
  const queryInterface = sequelize.getQueryInterface();

  for (const model of Object.values(models)) {
    const table = tableNameOf(model);
    let description: Record<string, unknown>;

    try {
      description = await queryInterface.describeTable(table);
    } catch (error) {
      logger.warn(`Skipping schema check for ${table}`, error);
      continue;
    }

    for (const attribute of Object.values(model.rawAttributes)) {
      const field = attribute.field;
      if (!field || hasColumn(description, field) || attribute.primaryKey) {
        continue;
      }

      try {
        await queryInterface.addColumn(table, field, {
          type: attribute.type,
          allowNull: true,
          ...(isPrimitiveDefault(attribute.defaultValue)
            ? { defaultValue: attribute.defaultValue }
            : {}),
        });
        logger.info(`Added missing column ${table}.${field}`);
      } catch (error) {
        logger.error(`Failed adding column ${table}.${field}`, error);
      }
    }
  }
}
