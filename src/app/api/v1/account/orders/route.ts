import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";
import { readCustomerSessionFromCookie } from "@/lib/auth/customer-request";
import { listOrdersByMobile } from "@/services/order-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await readCustomerSessionFromCookie();
    if (!session) {
      return NextResponse.json(success(null, "Not signed in"));
    }
    const orders = await listOrdersByMobile(session.mobile);
    return NextResponse.json(success({ session, orders }, "Orders loaded"));
  } catch (error) {
    return handleApiError(error);
  }
}
