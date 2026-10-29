import "server-only";

import { DataTypes, Model } from "sequelize";

import { sequelize } from "@/database/sequelize";

export class ShopCategory extends Model {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare description: string;
  declare live: boolean;
}

ShopCategory.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    slug: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(500), allowNull: false, defaultValue: "" },
    live: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    tableName: "shop_categories",
    modelName: "ShopCategory",
    underscored: true,
  },
);
