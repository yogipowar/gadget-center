import { NextResponse } from "next/server";

import { handleApiError } from "@/lib/api/error-handler";
import { success } from "@/lib/api/response";
import { requireStaffSession } from "@/lib/auth/staff-request";
import { listOrders } from "@/services/order-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireStaffSession();
    const orders = await listOrders();
    return NextResponse.json(success(orders, "Orders loaded"));
  } catch (error) {
    return handleApiError(error);
  }
}
