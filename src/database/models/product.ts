import "server-only";

import { DataTypes, Model } from "sequelize";

import { sequelize } from "@/database/sequelize";

export class Product extends Model {
  declare id: string;
  declare sku: string;
  declare slug: string;
  declare name: string;
  declare brand: string;
  declare categorySlug: string;
  declare productType: string;
  declare condition: string;
  declare grade: string | null;
  declare price: number;
  declare salePrice: number;
  declare warranty: string;
  declare specsJson: string;
  declare shortDescription: string;
  declare featured: boolean;
  declare bestseller: boolean;
  declare newArrival: boolean;
  declare inStock: boolean;
  declare onHand: number;
  declare accent: string;
  declare image: string | null;
  declare imagesJson: string;
}

Product.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    sku: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    slug: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    brand: { type: DataTypes.STRING(80), allowNull: false },
    categorySlug: { type: DataTypes.STRING(80), allowNull: false },
    productType: { type: DataTypes.STRING(40), allowNull: false },
    condition: { type: DataTypes.STRING(24), allowNull: false },
    grade: { type: DataTypes.STRING(16), allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: false },
    salePrice: { type: DataTypes.INTEGER, allowNull: false },
    warranty: { type: DataTypes.STRING(120), allowNull: false, defaultValue: "" },
    specsJson: { type: DataTypes.TEXT, allowNull: false, defaultValue: "[]" },
    shortDescription: { type: DataTypes.STRING(500), allowNull: false, defaultValue: "" },
    featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    bestseller: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    newArrival: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    inStock: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    onHand: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    accent: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "navy" },
    image: { type: DataTypes.STRING(300), allowNull: true },
    imagesJson: { type: DataTypes.TEXT, allowNull: false, defaultValue: "[]" },
  },
  {
    sequelize,
    tableName: "products",
    modelName: "Product",
    underscored: true,
  },
);
