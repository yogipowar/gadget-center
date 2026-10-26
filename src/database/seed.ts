import "server-only";

import { hash } from "bcryptjs";
import { randomUUID } from "node:crypto";

import { Lead } from "@/database/models/lead";
import { OrderItem } from "@/database/models/order-item";
import { Product } from "@/database/models/product";
import { ShopOrder } from "@/database/models/order";
import { StaffUser } from "@/database/models/staff-user";
import { fromCatalogProduct } from "@/database/product-mapper";
import { catalogProducts } from "@/features/catalog/products";

const ADMIN_EMAIL = "admin@gadgetcenter.local";
const ADMIN_PASSWORD = "admin123";

export async function seedDatabase() {
  await Promise.all([Product.sync(), StaffUser.sync(), ShopOrder.sync(), OrderItem.sync(), Lead.sync()]);

  const productCount = await Product.count();
  if (productCount === 0) {
    await Product.bulkCreate(catalogProducts.map((product) => fromCatalogProduct(product)));
  }

  const admin = await StaffUser.findOne({ where: { email: ADMIN_EMAIL } });
  if (!admin) {
    await StaffUser.create({
      id: randomUUID(),
      email: ADMIN_EMAIL,
      passwordHash: await hash(ADMIN_PASSWORD, 10),
      name: "Yogesh Powar",
      role: "SUPER_ADMIN",
    });
  }
}
