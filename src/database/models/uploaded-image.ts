import "server-only";

import { DataTypes, Model } from "sequelize";

import { sequelize } from "@/database/sequelize";

export class UploadedImage extends Model {
  declare id: string;
  declare mimeType: string;
  declare originalName: string;
  declare bytes: Buffer;
}

UploadedImage.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    mimeType: { type: DataTypes.STRING(80), allowNull: false },
    originalName: { type: DataTypes.STRING(200), allowNull: false, defaultValue: "" },
    bytes: { type: DataTypes.BLOB("long"), allowNull: false },
  },
  {
    sequelize,
    tableName: "uploaded_images",
    modelName: "UploadedImage",
    underscored: true,
  },
);
