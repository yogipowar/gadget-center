import { NextRequest, NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { ValidationError } from "@/lib/api/errors";
import { success } from "@/lib/api/response";
import { readCustomerSessionFromCookie } from "@/lib/auth/customer-request";
import { reportPayment } from "@/services/order-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { orderNumber?: string; mobile?: string };
    const orderNumber = body.orderNumber?.trim() ?? "";
    const session = await readCustomerSessionFromCookie();
    const mobile = body.mobile?.trim() || session?.mobile || "";
    if (!orderNumber || !mobile) {
      throw new ValidationError("Order number and mobile are required.");
    }
    const order = await reportPayment(orderNumber, mobile);
    return NextResponse.json(success(order, "Payment reported. We will confirm after the credit appears."));
  } catch (error) {
    return handleApiError(error);
  }
}
