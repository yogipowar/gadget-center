import "server-only";

import { DataTypes, Model } from "sequelize";

import { sequelize } from "@/database/sequelize";

export class ShopOrder extends Model {
  declare id: string;
  declare orderNumber: string;
  declare customerName: string;
  declare mobile: string;
  declare email: string | null;
  declare address: string;
  declare city: string;
  declare state: string;
  declare pincode: string;
  declare itemsSummary: string;
  declare total: number;
  declare status: string;
  declare paymentStatus: string;
  declare paymentMethod: string;
  declare razorpayOrderId: string | null;
  declare razorpayPaymentId: string | null;
  declare notes: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ShopOrder.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    orderNumber: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    customerName: { type: DataTypes.STRING(120), allowNull: false },
    mobile: { type: DataTypes.STRING(15), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: false },
    city: { type: DataTypes.STRING(80), allowNull: false },
    state: { type: DataTypes.STRING(80), allowNull: false },
    pincode: { type: DataTypes.STRING(12), allowNull: false },
    itemsSummary: { type: DataTypes.STRING(500), allowNull: false },
    total: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "PENDING" },
    paymentStatus: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "PENDING" },
    paymentMethod: { type: DataTypes.STRING(24), allowNull: false, defaultValue: "UPI" },
    razorpayOrderId: { type: DataTypes.STRING(64), allowNull: true, unique: true },
    razorpayPaymentId: { type: DataTypes.STRING(64), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    tableName: "orders",
    modelName: "ShopOrder",
    underscored: true,
  },
);
