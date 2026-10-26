import "server-only";

import { randomUUID } from "node:crypto";

import { ORDER_NUMBER_PREFIX } from "@/constants/orders";
import { OrderItem } from "@/database/models/order-item";
import { ShopOrder } from "@/database/models/order";
import { ensureDatabase } from "@/database/sequelize";
import type { AdminOrder } from "@/features/admin/types";
import type { CartLine, CheckoutPayment } from "@/features/cart/types";
import { env } from "@/config/env";
import { NotFoundError, ValidationError } from "@/lib/api/errors";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { getProductBySlug, reduceStock } from "@/services/product-service";

export type CheckoutInput = {
  customerName: string;
  mobile: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: CartLine[];
};

export type { CheckoutPayment };

function toAdminOrder(row: ShopOrder): AdminOrder {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    customer: row.customerName,
    mobile: row.mobile,
    items: row.itemsSummary,
    total: row.total,
    status: row.status as AdminOrder["status"],
    paymentStatus: row.paymentStatus as AdminOrder["paymentStatus"],
    paymentMethod: row.paymentMethod as AdminOrder["paymentMethod"],
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function listOrders() {
  await ensureDatabase();
  const rows = await ShopOrder.findAll({ order: [["created_at", "DESC"]] });
  return rows.map(toAdminOrder);
}

async function markOrderPaid(order: ShopOrder, paymentId: string) {
  if (order.paymentStatus === "PAID") {
    return toAdminOrder(order);
  }

  const items = await OrderItem.findAll({ where: { orderId: order.id } });
  for (const item of items) {
    if (item.productId) {
      await reduceStock(item.productId, item.quantity);
    }
  }

  await order.update({
    paymentStatus: "PAID",
    paymentMethod: "RAZORPAY",
    status: "CONFIRMED",
    razorpayPaymentId: paymentId,
  });
  return toAdminOrder(order);
}

export async function createCheckout(input: CheckoutInput) {
  await ensureDatabase();
  const name = input.customerName.trim();
  const mobile = input.mobile.replace(/\D/g, "");
  if (name.length < 2 || mobile.length !== 10 || input.address.trim().length < 8) {
    throw new ValidationError("Enter a valid name, 10-digit mobile and address.");
  }
  if (!input.items.length) {
    throw new ValidationError("Your cart is empty.");
  }

  const lines = [];
  for (const item of input.items) {
    const product = await getProductBySlug(item.slug);
    if (!product) {
      throw new ValidationError(`Product ${item.slug} is no longer available.`);
    }
    if (!product.inStock || (product.onHand ?? 0) < item.quantity) {
      throw new ValidationError(`${product.name} does not have enough stock.`);
    }
    lines.push({ product, quantity: item.quantity });
  }

  const total = lines.reduce((sum, line) => sum + line.product.salePrice * line.quantity, 0);
  const itemsSummary = lines
    .map((line) => `${line.quantity} x ${line.product.name}`)
    .join(", ")
    .slice(0, 500);
  const orderNumber = `${ORDER_NUMBER_PREFIX}${Date.now().toString().slice(-8)}`;

  const razorpay = await createRazorpayOrder({
    amountRupees: total,
    receipt: orderNumber,
    notes: { orderNumber, mobile },
  });

  const order = await ShopOrder.create({
    id: randomUUID(),
    orderNumber,
    customerName: name,
    mobile,
    email: input.email?.trim() || null,
    address: input.address.trim(),
    city: input.city.trim(),
    state: input.state.trim(),
    pincode: input.pincode.trim(),
    itemsSummary,
    total,
    status: "PENDING",
    paymentStatus: "PENDING",
    paymentMethod: "RAZORPAY",
    razorpayOrderId: razorpay.orderId,
  });

  for (const line of lines) {
    await OrderItem.create({
      id: randomUUID(),
      orderId: order.id,
      productId: line.product.id,
      slug: line.product.slug,
      name: line.product.name,
      quantity: line.quantity,
      unitPrice: line.product.salePrice,
    });
  }

  const payment: CheckoutPayment = {
    keyId: razorpay.keyId,
    orderId: razorpay.orderId,
    amount: razorpay.amount,
    currency: razorpay.currency,
    name: env.NEXT_PUBLIC_SITE_NAME,
    description: `Order ${order.orderNumber}`,
    prefill: {
      name,
      contact: mobile,
      email: input.email?.trim() || undefined,
    },
  };

  return { order: toAdminOrder(order), payment };
}

export async function confirmRazorpayPayment(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
}) {
  await ensureDatabase();
  const order = await ShopOrder.findOne({ where: { razorpayOrderId: input.razorpayOrderId } });
  if (!order) {
    throw new NotFoundError("Order not found for this payment.");
  }
  return markOrderPaid(order, input.razorpayPaymentId);
}
