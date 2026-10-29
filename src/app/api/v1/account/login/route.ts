import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { COOKIE_NAMES } from "@/constants/storage";
import { handleApiError } from "@/lib/api/error-handler";
import { ValidationError } from "@/lib/api/errors";
import { success } from "@/lib/api/response";
import { customerCookieOptions } from "@/lib/auth/customer-request";
import { signCustomerToken } from "@/lib/auth/customer-token";
import { findCustomerOrder, listOrdersByMobile, normalizeMobile } from "@/services/order-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { mobile?: string; orderNumber?: string };
    const mobile = normalizeMobile(body.mobile ?? "");
    const orderNumber = body.orderNumber?.trim() ?? "";
    if (mobile.length !== 10 || !orderNumber) {
      throw new ValidationError("Enter your 10-digit mobile and order number.");
    }
    const match = await findCustomerOrder(orderNumber, mobile);
    const token = await signCustomerToken({ mobile: match.mobile, name: match.customer });
    const jar = await cookies();
    jar.set(COOKIE_NAMES.customerSession, token, customerCookieOptions);
    const orders = await listOrdersByMobile(match.mobile);
    return NextResponse.json(success({ session: { mobile: match.mobile, name: match.customer }, orders }, "Signed in"));
  } catch (error) {
    return handleApiError(error);
  }
}
