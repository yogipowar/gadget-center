import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { env } from "@/config/env";
import { ServiceUnavailableError, ValidationError } from "@/lib/api/errors";

const RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";

export function isRazorpayConfigured() {
  return Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);
}

function basicAuthHeader() {
  return `Basic ${Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString("base64")}`;
}

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function createRazorpayOrder(input: {
  amountRupees: number;
  receipt: string;
  notes?: Record<string, string>;
}) {
  if (!isRazorpayConfigured()) {
    throw new ServiceUnavailableError(
      "Online payment is not configured yet. Add Razorpay keys on the server.",
    );
  }

  const response = await fetch(RAZORPAY_ORDERS_URL, {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountRupees * 100,
      currency: "INR",
      receipt: input.receipt.slice(0, 40),
      notes: input.notes,
    }),
  });
  const payload = (await response.json()) as {
    id?: string;
    amount?: number;
    currency?: string;
    error?: { description?: string };
  };
  if (!response.ok || !payload.id || payload.amount == null) {
    throw new ValidationError(payload.error?.description || "Could not start online payment.");
  }

  return {
    keyId: env.RAZORPAY_KEY_ID,
    orderId: payload.id,
    amount: payload.amount,
    currency: payload.currency || "INR",
  };
}

export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  if (!env.RAZORPAY_KEY_SECRET) {
    return false;
  }
  const expected = createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return signaturesMatch(expected, signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  if (!env.RAZORPAY_WEBHOOK_SECRET || !signature) {
    return false;
  }
  const expected = createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest("hex");
  return signaturesMatch(expected, signature);
}
