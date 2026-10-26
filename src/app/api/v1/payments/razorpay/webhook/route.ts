import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { UnauthorizedError } from "@/lib/api/errors";
import { success } from "@/lib/api/response";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { confirmRazorpayPayment } from "@/services/order-service";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

type RazorpayWebhookBody = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
      };
    };
  };
};

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") ?? "";
    if (!verifyWebhookSignature(rawBody, signature)) {
      throw new UnauthorizedError("Invalid Razorpay webhook signature.");
    }

    const body = JSON.parse(rawBody) as RazorpayWebhookBody;
    const payment = body.payload?.payment?.entity;
    if (body.event === "payment.captured" && payment?.id && payment.order_id) {
      await confirmRazorpayPayment({
        razorpayOrderId: payment.order_id,
        razorpayPaymentId: payment.id,
      });
    }

    return NextResponse.json(success({ received: true }));
  } catch (error) {
    logger.error("Razorpay webhook failed", error);
    return handleApiError(error);
  }
}
