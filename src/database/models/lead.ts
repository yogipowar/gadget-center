import "server-only";

import { DataTypes, Model } from "sequelize";

import { sequelize } from "@/database/sequelize";

export class Lead extends Model {
  declare id: string;
  declare leadNumber: string;
  declare name: string;
  declare mobile: string;
  declare email: string | null;
  declare address: string;
  declare interestedCategory: string | null;
  declare source: string;
  declare campaign: string | null;
  declare adSet: string | null;
  declare ad: string | null;
  declare landingPage: string | null;
  declare status: string;
  declare priority: string;
}

Lead.init(
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true },
    leadNumber: { type: DataTypes.STRING(32), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    mobile: { type: DataTypes.STRING(15), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: false },
    interestedCategory: { type: DataTypes.STRING(40), allowNull: true },
    source: { type: DataTypes.STRING(32), allowNull: false },
    campaign: { type: DataTypes.STRING(160), allowNull: true },
    adSet: { type: DataTypes.STRING(160), allowNull: true },
    ad: { type: DataTypes.STRING(160), allowNull: true },
    landingPage: { type: DataTypes.STRING(500), allowNull: true },
    referrer: { type: DataTypes.STRING(500), allowNull: true },
    fbclid: { type: DataTypes.STRING(255), allowNull: true },
    utmSource: { type: DataTypes.STRING(120), allowNull: true },
    utmMedium: { type: DataTypes.STRING(120), allowNull: true },
    utmCampaign: { type: DataTypes.STRING(160), allowNull: true },
    utmContent: { type: DataTypes.STRING(160), allowNull: true },
    utmTerm: { type: DataTypes.STRING(160), allowNull: true },
    userAgent: { type: DataTypes.STRING(255), allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "NEW" },
    priority: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "WARM" },
  },
  {
    sequelize,
    tableName: "leads",
    modelName: "Lead",
    underscored: true,
  },
);
