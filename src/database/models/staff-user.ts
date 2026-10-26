import "server-only";

import { DataTypes, Model } from "sequelize";

import { sequelize } from "@/database/sequelize";

export class StaffUser extends Model {
  declare id: string;
  declare email: string;
  declare passwordHash: string;
  declare name: string;
  declare role: string;
}

StaffUser.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(120), allowNull: false },
    name: { type: DataTypes.STRING(120), allowNull: false },
    role: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "SUPER_ADMIN" },
  },
  {
    sequelize,
    tableName: "staff_users",
    modelName: "StaffUser",
    underscored: true,
  },
);
