import "server-only";

import { randomUUID } from "node:crypto";
import { Op } from "sequelize";

import { ORDER_NUMBER_PREFIX } from "@/constants/orders";
import { OrderItem } from "@/database/models/order-item";
import { ShopOrder } from "@/database/models/order";
import { ensureDatabase } from "@/database/sequelize";
import type { AdminOrder, AdminOrderLine } from "@/features/admin/types";
import type { CartLine, CheckoutPayment } from "@/features/cart/types";
import { publicEnv } from "@/config/public-env";
import { NotFoundError, ValidationError } from "@/lib/api/errors";
import { buildUpiPayUrl, canPayByUpi } from "@/lib/upi";
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

const PAYMENT_REPORTED_PREFIX = "PAYMENT_REPORTED";

export function normalizeMobile(value: string) {
  return value.replace(/\D/g, "").slice(-10);
}

export function normalizeOrderNumber(value: string) {
  const trimmed = value.trim().toUpperCase();
  if (trimmed.startsWith(ORDER_NUMBER_PREFIX)) {
    return trimmed;
  }
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `${ORDER_NUMBER_PREFIX}${digits}` : trimmed;
}

function toLineItems(rows: OrderItem[]): AdminOrderLine[] {
  return rows.map((item) => ({
    name: item.name,
    slug: item.slug,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));
}

function toAdminOrder(row: ShopOrder, lineItems: AdminOrderLine[] = []): AdminOrder {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    customer: row.customerName,
    mobile: row.mobile,
    email: row.email,
    address: row.address,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    items: row.itemsSummary,
    lineItems,
    total: row.total,
    status: row.status as AdminOrder["status"],
    paymentStatus: row.paymentStatus as AdminOrder["paymentStatus"],
    paymentMethod: row.paymentMethod as AdminOrder["paymentMethod"],
    paymentReported: Boolean(row.notes?.startsWith(PAYMENT_REPORTED_PREFIX)),
    notes: row.notes,
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
  };
}

async function lineItemsForOrders(orderIds: string[]) {
  if (orderIds.length === 0) {
    return new Map<string, AdminOrderLine[]>();
  }
  const rows = await OrderItem.findAll({ where: { orderId: { [Op.in]: orderIds } } });
  const grouped = new Map<string, AdminOrderLine[]>();
  for (const row of rows) {
    const current = grouped.get(row.orderId) ?? [];
    current.push(...toLineItems([row]));
    grouped.set(row.orderId, current);
  }
  return grouped;
}

export async function listOrders() {
  await ensureDatabase();
  const rows = await ShopOrder.findAll({ order: [["created_at", "DESC"]] });
  const grouped = await lineItemsForOrders(rows.map((row) => row.id));
  return rows.map((row) => toAdminOrder(row, grouped.get(row.id) ?? []));
}

export async function listOrdersByMobile(mobile: string) {
  await ensureDatabase();
  const rows = await ShopOrder.findAll({
    where: { mobile: normalizeMobile(mobile) },
    order: [["created_at", "DESC"]],
  });
  const grouped = await lineItemsForOrders(rows.map((row) => row.id));
  return rows.map((row) => toAdminOrder(row, grouped.get(row.id) ?? []));
}

export async function findCustomerOrder(orderNumber: string, mobile: string) {
  await ensureDatabase();
  const order = await ShopOrder.findOne({
    where: {
      orderNumber: normalizeOrderNumber(orderNumber),
      mobile: normalizeMobile(mobile),
    },
  });
  if (!order) {
    throw new NotFoundError("No order matches that mobile number and order number.");
  }
  return toAdminOrder(order);
}

export async function reportPayment(orderNumber: string, mobile: string) {
  await ensureDatabase();
  const order = await ShopOrder.findOne({
    where: {
      orderNumber: normalizeOrderNumber(orderNumber),
      mobile: normalizeMobile(mobile),
    },
  });
  if (!order) {
    throw new NotFoundError("Order not found.");
  }
  if (order.paymentStatus !== "PAID") {
    await order.update({
      notes: `${PAYMENT_REPORTED_PREFIX} ${new Date().toISOString()}`,
    });
  }
  return toAdminOrder(order);
}

async function markOrderPaid(order: ShopOrder, method: AdminOrder["paymentMethod"], paymentId?: string) {
  const items = await OrderItem.findAll({ where: { orderId: order.id } });
  if (order.paymentStatus === "PAID") {
    return toAdminOrder(order, toLineItems(items));
  }

  for (const item of items) {
    if (item.productId) {
      await reduceStock(item.productId, item.quantity);
    }
  }

  await order.update({
    paymentStatus: "PAID",
    paymentMethod: method,
    status: "CONFIRMED",
    razorpayPaymentId: paymentId || order.razorpayPaymentId,
  });
  return toAdminOrder(order, toLineItems(items));
}

export async function getOrderById(id: string) {
  await ensureDatabase();
  const order = await ShopOrder.findByPk(id);
  if (!order) {
    throw new NotFoundError("Order not found.");
  }
  const grouped = await lineItemsForOrders([order.id]);
  return toAdminOrder(order, grouped.get(order.id) ?? []);
}

export async function markOrderPaidById(orderId: string) {
  await ensureDatabase();
  const order = await ShopOrder.findByPk(orderId);
  if (!order) {
    throw new NotFoundError("Order not found.");
  }
  const method = order.paymentMethod === "BANK" ? "BANK" : order.paymentMethod === "UPI" ? "UPI" : "UPI";
  return markOrderPaid(order, method);
}

export async function createCheckout(input: CheckoutInput) {
  await ensureDatabase();
  const name = input.customerName.trim();
  const mobile = normalizeMobile(input.mobile);
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
  const method = canPayByUpi(total) ? "UPI" : "BANK";

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
    paymentMethod: method,
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
    method,
    amount: total,
    orderNumber: order.orderNumber,
    upiId: publicEnv.upiId,
    upiUri: canPayByUpi(total)
      ? buildUpiPayUrl({ amountRupees: total, orderNumber: order.orderNumber })
      : null,
    payeeName: publicEnv.bankAccountName,
    bank: {
      accountName: publicEnv.bankAccountName,
      bankName: publicEnv.bankName,
      accountNumber: publicEnv.bankAccountNumber,
      ifsc: publicEnv.bankIfsc,
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
  return markOrderPaid(order, "RAZORPAY", input.razorpayPaymentId);
}
