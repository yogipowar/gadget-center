import "server-only";

import { DataTypes, Model } from "sequelize";

import { sequelize } from "@/database/sequelize";

export class OrderItem extends Model {
  declare id: string;
  declare orderId: string;
  declare productId: string | null;
  declare slug: string;
  declare name: string;
  declare quantity: number;
  declare unitPrice: number;
}

OrderItem.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    orderId: { type: DataTypes.STRING(64), allowNull: false },
    productId: { type: DataTypes.STRING(64), allowNull: true },
    slug: { type: DataTypes.STRING(160), allowNull: false },
    name: { type: DataTypes.STRING(200), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unitPrice: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: "order_items",
    modelName: "OrderItem",
    underscored: true,
  },
);
