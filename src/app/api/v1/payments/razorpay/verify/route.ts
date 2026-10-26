import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { COOKIE_NAMES } from "@/constants/storage";
import { handleApiError } from "@/lib/api/error-handler";
import { ValidationError } from "@/lib/api/errors";
import { success } from "@/lib/api/response";
import { verifyCheckoutSignature } from "@/lib/payments/razorpay";
import { confirmRazorpayPayment } from "@/services/order-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };
    const orderId = body.razorpay_order_id?.trim() ?? "";
    const paymentId = body.razorpay_payment_id?.trim() ?? "";
    const signature = body.razorpay_signature?.trim() ?? "";
    if (!orderId || !paymentId || !signature) {
      throw new ValidationError("Payment details are incomplete.");
    }
    if (!verifyCheckoutSignature(orderId, paymentId, signature)) {
      throw new ValidationError("Payment signature could not be verified.");
    }

    const order = await confirmRazorpayPayment({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
    });
    const jar = await cookies();
    jar.set(COOKIE_NAMES.cart, JSON.stringify({ items: [] }), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return NextResponse.json(success(order, "Payment received"));
  } catch (error) {
    return handleApiError(error);
  }
}
