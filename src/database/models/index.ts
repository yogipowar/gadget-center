import "server-only";

import { OrderItem } from "@/database/models/order-item";
import { ShopOrder } from "@/database/models/order";
import { Lead } from "@/database/models/lead";
import { Product } from "@/database/models/product";
import { StaffUser } from "@/database/models/staff-user";
import { ShopCategory } from "@/database/models/shop-category";
import { UploadedImage } from "@/database/models/uploaded-image";
import { sequelize } from "@/database/sequelize";

ShopOrder.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(ShopOrder, { foreignKey: "orderId", as: "order" });

export const models = {
  Product,
  StaffUser,
  ShopOrder,
  OrderItem,
  Lead,
  UploadedImage,
  ShopCategory,
} as const;

export function getSequelize() {
  return sequelize;
}

export { sequelize, Product, StaffUser, ShopOrder, OrderItem, Lead, UploadedImage, ShopCategory };
